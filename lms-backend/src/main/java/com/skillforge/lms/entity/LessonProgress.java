package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "lesson_id"}))
@Getter @Setter
@Builder
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private boolean completed;

    @Column(name = "progress_pct", precision = 5, scale = 2)
    private BigDecimal progressPct = BigDecimal.ZERO;

    @Column(name = "last_position")
    private Integer lastPosition;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public LessonProgress() {
    }

    public LessonProgress(Long id, User user, Lesson lesson, Course course, boolean completed, BigDecimal progressPct, Integer lastPosition, LocalDateTime completedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.lesson = lesson;
        this.course = course;
        this.completed = completed;
        this.progressPct = progressPct;
        this.lastPosition = lastPosition;
        this.completedAt = completedAt;
        this.updatedAt = updatedAt;
    }
}
