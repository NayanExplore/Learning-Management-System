package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
@Getter @Setter
@Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Channel channel;

    @Column(nullable = false)
    private String recipient;

    @Column(name = "template_name")
    private String templateName;

    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotifStatus status = NotifStatus.PENDING;

    @Column(name = "provider_message_id")
    private String providerMessageId;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "retry_count")
    private int retryCount;

    @Column(columnDefinition = "json")
    private String payload;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public NotificationLog() {
    }

    public NotificationLog(Long id, User user, Channel channel, String recipient, String templateName, String subject, NotifStatus status, String providerMessageId, String errorMessage, int retryCount, String payload, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.channel = channel;
        this.recipient = recipient;
        this.templateName = templateName;
        this.subject = subject;
        this.status = status;
        this.providerMessageId = providerMessageId;
        this.errorMessage = errorMessage;
        this.retryCount = retryCount;
        this.payload = payload;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public enum Channel {
        EMAIL, SMS, WHATSAPP
    }

    public enum NotifStatus {
        PENDING, SENT, DELIVERED, FAILED, BOUNCED
    }
}
