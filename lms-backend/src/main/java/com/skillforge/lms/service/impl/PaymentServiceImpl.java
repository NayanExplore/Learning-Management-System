package com.skillforge.lms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.order.CreateOrderRequest;
import com.skillforge.lms.dto.order.OrderResponseDto;
import com.skillforge.lms.dto.order.PaymentVerificationRequest;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.PaymentVerificationException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.AuditLogRepository;
import com.skillforge.lms.repository.CourseRepository;
import com.skillforge.lms.repository.OrderRepository;
import com.skillforge.lms.repository.PaymentRepository;
import com.skillforge.lms.service.EnrollmentService;
import com.skillforge.lms.service.NotificationService;
import com.skillforge.lms.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final AppProperties appProperties;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentService enrollmentService;
    private final NotificationService notificationService;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public PaymentServiceImpl(AppProperties appProperties, OrderRepository orderRepository, PaymentRepository paymentRepository, CourseRepository courseRepository, EnrollmentService enrollmentService, NotificationService notificationService, AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.appProperties = appProperties;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentService = enrollmentService;
        this.notificationService = notificationService;
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public OrderResponseDto createOrder(CreateOrderRequest request, User user) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        if (course.getStatus() != Course.CourseStatus.PUBLISHED) {
            throw new BadRequestException("This course is currently not open for enrollment.");
        }

        if (enrollmentService.isEnrolled(user.getId(), course.getId())) {
            throw new BadRequestException("You are already enrolled in this course.");
        }

        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .course(course)
                .amount(course.getPrice()) // Authoritative server-side price!
                .currency(course.getCurrency())
                .status(Order.OrderStatus.PENDING)
                .build();

        // Instant enrollment for 0-price / free courses
        if (course.getPrice() == null || course.getPrice().compareTo(BigDecimal.ZERO) == 0) {
            order.setStatus(Order.OrderStatus.PAID);
            order.setRazorpayOrderId("free_" + System.currentTimeMillis());
            order = orderRepository.save(order);
            enrollmentService.enrollStudent(user, course);
            log.info("Free course enrollment: Created order {} for course {} and user {}", orderNumber, course.getTitle(), user.getEmail());
            return OrderResponseDto.fromEntity(order, null);
        }

        // Integrate with Razorpay Orders API if live credentials exist
        var rzConfig = appProperties.getRazorpay();
        if (StringUtils.hasText(rzConfig.getKeyId()) && StringUtils.hasText(rzConfig.getKeySecret())
                && !rzConfig.getKeyId().contains("placeholder")) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBasicAuth(rzConfig.getKeyId(), rzConfig.getKeySecret());

                // Amount in paise
                long amountInPaise = course.getPrice().multiply(new BigDecimal(100)).longValue();
                Map<String, Object> body = Map.of(
                        "amount", amountInPaise,
                        "currency", course.getCurrency(),
                        "receipt", orderNumber,
                        "notes", Map.of("courseId", course.getId().toString(), "userId", user.getId().toString())
                );

                HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(
                        "https://api.razorpay.com/v1/orders", httpEntity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    order.setRazorpayOrderId(root.get("id").asText());
                }
            } catch (Exception ex) {
                log.error("Failed to create Razorpay order: {}", ex.getMessage());
                // Fallback to sandbox order for testing
                order.setRazorpayOrderId("order_sandbox_" + System.currentTimeMillis());
            }
        } else {
            // Development / Test sandbox order
            order.setRazorpayOrderId("order_sandbox_" + System.currentTimeMillis());
        }

        order = orderRepository.save(order);
        log.info("Created order {} for course {} and user {}", orderNumber, course.getTitle(), user.getEmail());

        String keyIdToReturn = order.getRazorpayOrderId().startsWith("order_sandbox_") ? null : rzConfig.getKeyId();
        return OrderResponseDto.fromEntity(order, keyIdToReturn);
    }

    @Override
    @Transactional
    public boolean verifyPaymentSignature(PaymentVerificationRequest request, User user) {
        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order with Razorpay order ID " + request.getRazorpayOrderId() + " not found."));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to the authenticated user.");
        }

        // Idempotency check: if order is already marked PAID, return true
        if (order.getStatus() == Order.OrderStatus.PAID) {
            log.info("Order {} already marked as PAID, idempotent return", order.getOrderNumber());
            return true;
        }

        // Verify Razorpay HMAC-SHA256 signature
        var rzConfig = appProperties.getRazorpay();
        if (StringUtils.hasText(rzConfig.getKeySecret()) && !order.getRazorpayOrderId().startsWith("order_sandbox_")) {
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            String expectedSignature = calculateHmacSha256(payload, rzConfig.getKeySecret());

            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8),
                    request.getRazorpaySignature().getBytes(StandardCharsets.UTF_8))) {
                log.error("Signature mismatch for order {}. Expected: {}, Received: {}",
                        order.getOrderNumber(), expectedSignature, request.getRazorpaySignature());
                order.setStatus(Order.OrderStatus.FAILED);
                orderRepository.save(order);
                throw new PaymentVerificationException("Invalid payment signature verification failed.");
            }
        } else {
            log.info("[SANDBOX] Razorpay key secret not configured or sandbox order; verified payment in sandbox mode.");
        }

        // Record payment entity
        Payment payment = Payment.builder()
                .order(order)
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpaySignature(request.getRazorpaySignature())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .status(Payment.PaymentStatus.CAPTURED)
                .build();
        paymentRepository.save(payment);

        // Update Order to PAID
        order.setStatus(Order.OrderStatus.PAID);
        orderRepository.save(order);

        // Enroll student into course
        enrollmentService.enrollStudent(user, order.getCourse());

        // Audit log
        auditLogRepository.save(AuditLog.builder()
                .userId(user.getId())
                .action("PAYMENT_VERIFIED")
                .entityType("ORDER")
                .entityId(order.getId())
                .details(String.format("{\"orderNumber\":\"%s\",\"amount\":%s}", order.getOrderNumber(), order.getAmount()))
                .build());

        // Send confirmation notifications
        notificationService.sendOrderConfirmation(user, order.getCourse().getTitle(),
                order.getOrderNumber(), order.getAmount().toString());

        return true;
    }

    @Override
    @Transactional
    public void processWebhook(String rawBody, String signatureHeader) {
        var rzConfig = appProperties.getRazorpay();
        if (StringUtils.hasText(rzConfig.getWebhookSecret())) {
            String expectedSig = calculateHmacSha256(rawBody, rzConfig.getWebhookSecret());
            if (!MessageDigest.isEqual(expectedSig.getBytes(StandardCharsets.UTF_8),
                    signatureHeader.getBytes(StandardCharsets.UTF_8))) {
                throw new PaymentVerificationException("Webhook signature verification failed");
            }
        }

        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String event = root.path("event").asText();
            log.info("Received Razorpay webhook event: {}", event);

            if ("payment.captured".equals(event) || "order.paid".equals(event)) {
                JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
                String rzOrderId = paymentEntity.path("order_id").asText();
                String rzPaymentId = paymentEntity.path("id").asText();

                var orderOpt = orderRepository.findByRazorpayOrderId(rzOrderId);
                if (orderOpt.isPresent()) {
                    Order order = orderOpt.get();
                    if (order.getStatus() != Order.OrderStatus.PAID) {
                        order.setStatus(Order.OrderStatus.PAID);
                        orderRepository.save(order);

                        // Save payment if not exists
                        if (!paymentRepository.existsByRazorpayPaymentId(rzPaymentId)) {
                            Payment payment = Payment.builder()
                                    .order(order)
                                    .razorpayPaymentId(rzPaymentId)
                                    .razorpayOrderId(rzOrderId)
                                    .amount(order.getAmount())
                                    .currency(order.getCurrency())
                                    .status(Payment.PaymentStatus.CAPTURED)
                                    .webhookVerified(true)
                                    .build();
                            paymentRepository.save(payment);
                        }

                        // Ensure enrollment
                        enrollmentService.enrollStudent(order.getUser(), order.getCourse());

                        // Send confirmation
                        notificationService.sendOrderConfirmation(order.getUser(), order.getCourse().getTitle(),
                                order.getOrderNumber(), order.getAmount().toString());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error processing webhook payload", e);
            throw new BadRequestException("Webhook processing error: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getUserOrders(User user, Pageable pageable) {
        return orderRepository.findByUserId(user.getId(), pageable)
                .map(o -> OrderResponseDto.fromEntity(o, appProperties.getRazorpay().getKeyId()));
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    private String calculateHmacSha256(String data, String secret) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating HMAC-SHA256", e);
        }
    }
}
