package com.skillforge.lms.controller;

import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.common.PageResponse;
import com.skillforge.lms.dto.order.CreateOrderRequest;
import com.skillforge.lms.dto.order.OrderResponseDto;
import com.skillforge.lms.dto.order.PaymentVerificationRequest;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1")
@Tag(name = "Orders & Payments", description = "Order checkout, Razorpay payments, and webhook handling")
public class OrderPaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;

    public OrderPaymentController(PaymentService paymentService, AuthService authService) {
        this.paymentService = paymentService;
        this.authService = authService;
    }

    @PostMapping("/orders")
    @Operation(summary = "Initiate course checkout and create authoritative order")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        User user = authService.getCurrentUser();
        OrderResponseDto order = paymentService.createOrder(request, user);
        return ResponseEntity.ok(ApiResponse.success("Order initiated successfully", order));
    }

    @PostMapping("/payments/verify")
    @Operation(summary = "Verify Razorpay payment signature and complete enrollment")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request) {
        User user = authService.getCurrentUser();
        boolean verified = paymentService.verifyPaymentSignature(request, user);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and enrolled successfully", verified));
    }

    @PostMapping("/payments/webhook")
    @Operation(summary = "Handle incoming Razorpay webhooks with signature verification")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String rawBody,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signatureHeader) {
        paymentService.processWebhook(rawBody, signatureHeader);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/orders/history")
    @Operation(summary = "Get current user purchase history")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponseDto>>> getOrderHistory(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        User user = authService.getCurrentUser();
        var page = paymentService.getUserOrders(user, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }
}
