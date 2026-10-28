package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter @Setter
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "passing_score")
    private int passingScore = 70;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;

    @Column(name = "is_required")
    private boolean required;

    @Column(name = "sort_order")
    private int sortOrder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<QuizQuestion> questions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Quiz() {
    }

    public Quiz(Long id, Course course, Lesson lesson, String title, String description, int passingScore, Integer maxAttempts, Integer timeLimitMinutes, boolean required, int sortOrder, LocalDateTime createdAt, LocalDateTime updatedAt, List<QuizQuestion> questions) {
        this.id = id;
        this.course = course;
        this.lesson = lesson;
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.maxAttempts = maxAttempts;
        this.timeLimitMinutes = timeLimitMinutes;
        this.required = required;
        this.sortOrder = sortOrder;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.questions = questions;
    }
}
