package com.skillforge.lms.repository;

import com.skillforge.lms.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    boolean existsByUserIdAndCourseIdAndStatus(Long userId, Long courseId, Order.OrderStatus status);
    long countByStatus(Order.OrderStatus status);
}
