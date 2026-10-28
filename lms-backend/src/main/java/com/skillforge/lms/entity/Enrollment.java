package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"}))
@Getter @Setter
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(name = "enrolled_at", updatable = false)
    private LocalDateTime enrolledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "progress_pct", precision = 5, scale = 2)
    private BigDecimal progressPct = BigDecimal.ZERO;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
    }

    public Enrollment() {
    }

    public Enrollment(Long id, User user, Course course, EnrollmentStatus status, LocalDateTime enrolledAt, LocalDateTime completedAt, BigDecimal progressPct) {
        this.id = id;
        this.user = user;
        this.course = course;
        this.status = status;
        this.enrolledAt = enrolledAt;
        this.completedAt = completedAt;
        this.progressPct = progressPct;
    }

    public enum EnrollmentStatus {
        ACTIVE, COMPLETED, SUSPENDED
    }
}
