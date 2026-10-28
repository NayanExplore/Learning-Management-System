package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_records")
@Getter @Setter
@Builder
public class OtpRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String phone;
    private String email;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OtpPurpose purpose;

    private int attempts;
    private boolean verified;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public OtpRecord() {
    }

    public OtpRecord(Long id, User user, String phone, String email, String otpHash, OtpPurpose purpose, int attempts, boolean verified, LocalDateTime expiresAt, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.phone = phone;
        this.email = email;
        this.otpHash = otpHash;
        this.purpose = purpose;
        this.attempts = attempts;
        this.verified = verified;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }

    public enum OtpPurpose {
        PHONE_VERIFY, EMAIL_VERIFY, PASSWORD_RESET, LOGIN
    }
}
