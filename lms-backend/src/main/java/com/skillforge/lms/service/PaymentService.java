package com.skillforge.lms.service;

import com.skillforge.lms.dto.order.CreateOrderRequest;
import com.skillforge.lms.dto.order.OrderResponseDto;
import com.skillforge.lms.dto.order.PaymentVerificationRequest;
import com.skillforge.lms.entity.Order;
import com.skillforge.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    OrderResponseDto createOrder(CreateOrderRequest request, User user);
    boolean verifyPaymentSignature(PaymentVerificationRequest request, User user);
    void processWebhook(String rawBody, String signatureHeader);
    Page<OrderResponseDto> getUserOrders(User user, Pageable pageable);
    Order getOrderEntity(Long id);
}
