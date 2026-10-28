package com.skillforge.lms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.order.CreateOrderRequest;
import com.skillforge.lms.dto.order.PaymentVerificationRequest;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.Order;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.PaymentVerificationException;
import com.skillforge.lms.repository.AuditLogRepository;
import com.skillforge.lms.repository.CourseRepository;
import com.skillforge.lms.repository.OrderRepository;
import com.skillforge.lms.repository.PaymentRepository;
import com.skillforge.lms.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private AppProperties appProperties;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private EnrollmentService enrollmentService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private User sampleUser;
    private Course sampleCourse;
    private AppProperties.RazorpayProperties rzProps;

    @BeforeEach
    void setUp() {
        rzProps = new AppProperties.RazorpayProperties();
        rzProps.setKeyId("rzp_test_key");
        rzProps.setKeySecret("rzp_secret_12345");
        rzProps.setWebhookSecret("rzp_webhook_12345");

        lenient().when(appProperties.getRazorpay()).thenReturn(rzProps);

        sampleUser = User.builder()
                .id(1L)
                .email("student@test.com")
                .fullName("Test Student")
                .role(User.Role.STUDENT)
                .build();

        sampleCourse = Course.builder()
                .id(10L)
                .title("Full Stack Web Development")
                .price(new BigDecimal("4999.00"))
                .currency("INR")
                .status(Course.CourseStatus.PUBLISHED)
                .build();
    }

    @Test
    void createOrder_UsesAuthoritativeServerPrice() {
        CreateOrderRequest req = new CreateOrderRequest();
        req.setCourseId(10L);

        when(courseRepository.findById(10L)).thenReturn(Optional.of(sampleCourse));
        when(enrollmentService.isEnrolled(1L, 10L)).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setId(100L);
            return o;
        });

        var orderRes = paymentService.createOrder(req, sampleUser);

        assertNotNull(orderRes);
        assertEquals(new BigDecimal("4999.00"), orderRes.getAmount());
        assertEquals("INR", orderRes.getCurrency());
        verify(orderRepository).save(argThat(order ->
                order.getAmount().compareTo(new BigDecimal("4999.00")) == 0
        ));
    }

    @Test
    void verifyPaymentSignature_ValidHmac_EnrollsStudent() throws Exception {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-123")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .currency("INR")
                .status(Order.OrderStatus.PENDING)
                .razorpayOrderId("order_rzp_123")
                .build();

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(order));

        // Generate valid HMAC-SHA256 signature
        String payload = "order_rzp_123|pay_rzp_456";
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        sha256Hmac.init(new SecretKeySpec("rzp_secret_12345".getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        String validSig = HexFormat.of().formatHex(sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setRazorpayOrderId("order_rzp_123");
        req.setRazorpayPaymentId("pay_rzp_456");
        req.setRazorpaySignature(validSig);

        boolean result = paymentService.verifyPaymentSignature(req, sampleUser);

        assertTrue(result);
        assertEquals(Order.OrderStatus.PAID, order.getStatus());
        verify(enrollmentService).enrollStudent(sampleUser, sampleCourse);
        verify(notificationService).sendOrderConfirmation(any(), any(), any(), any());
    }

    @Test
    void verifyPaymentSignature_InvalidSignature_ThrowsException() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-123")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PENDING)
                .razorpayOrderId("order_rzp_123")
                .build();

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(order));

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setRazorpayOrderId("order_rzp_123");
        req.setRazorpayPaymentId("pay_rzp_456");
        req.setRazorpaySignature("tampered_forged_signature");

        assertThrows(PaymentVerificationException.class, () ->
                paymentService.verifyPaymentSignature(req, sampleUser));

        assertEquals(Order.OrderStatus.FAILED, order.getStatus());
        verify(enrollmentService, never()).enrollStudent(any(), any());
    }

    @Test
    void verifyPaymentSignature_AlreadyPaid_Idempotent() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-123")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PAID)
                .razorpayOrderId("order_rzp_123")
                .build();

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(order));

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setRazorpayOrderId("order_rzp_123");
        req.setRazorpayPaymentId("pay_rzp_456");
        req.setRazorpaySignature("signature");

        boolean result = paymentService.verifyPaymentSignature(req, sampleUser);

        assertTrue(result);
        // Verify we didn't re-enroll or double charge
        verify(enrollmentService, never()).enrollStudent(any(), any());
    }
}
