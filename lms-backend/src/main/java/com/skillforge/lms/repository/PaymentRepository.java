package com.skillforge.lms.repository;

import com.skillforge.lms.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Page<Payment> findByOrderId(Long orderId, Pageable pageable);
    boolean existsByRazorpayPaymentId(String razorpayPaymentId);
}
