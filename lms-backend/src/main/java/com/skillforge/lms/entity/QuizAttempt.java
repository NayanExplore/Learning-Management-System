package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Getter @Setter
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "total_points")
    private Integer totalPoints;

    @Column(name = "earned_points")
    private Integer earnedPoints;

    private Boolean passed;

    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    @PrePersist
    protected void onCreate() {
        startedAt = LocalDateTime.now();
    }

    public QuizAttempt() {
    }

    public QuizAttempt(Long id, Quiz quiz, User user, BigDecimal score, Integer totalPoints, Integer earnedPoints, Boolean passed, LocalDateTime startedAt, LocalDateTime submittedAt, AttemptStatus status) {
        this.id = id;
        this.quiz = quiz;
        this.user = user;
        this.score = score;
        this.totalPoints = totalPoints;
        this.earnedPoints = earnedPoints;
        this.passed = passed;
        this.startedAt = startedAt;
        this.submittedAt = submittedAt;
        this.status = status;
    }

    public enum AttemptStatus {
        IN_PROGRESS, SUBMITTED, GRADED
    }
}
