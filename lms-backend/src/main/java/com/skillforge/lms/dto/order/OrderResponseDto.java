package com.skillforge.lms.dto.order;

import com.skillforge.lms.entity.Order;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@Builder
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private Long courseId;
    private String courseTitle;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String razorpayOrderId;
    private String razorpayKeyId;
    private LocalDateTime createdAt;

    public OrderResponseDto() {
    }

    public OrderResponseDto(Long id, String orderNumber, Long courseId, String courseTitle, BigDecimal amount, String currency, String status, String razorpayOrderId, String razorpayKeyId, LocalDateTime createdAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayKeyId = razorpayKeyId;
        this.createdAt = createdAt;
    }

    public static OrderResponseDto fromEntity(Order order, String razorpayKeyId) {
        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .courseId(order.getCourse().getId())
                .courseTitle(order.getCourse().getTitle())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .status(order.getStatus().name())
                .razorpayOrderId(order.getRazorpayOrderId())
                .razorpayKeyId(razorpayKeyId)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
