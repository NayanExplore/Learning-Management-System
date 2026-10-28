package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter @Setter
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "instructor_name")
    private String instructorName;

    @Column(name = "instructor_bio", columnDefinition = "TEXT")
    private String instructorBio;

    @Column(name = "instructor_avatar")
    private String instructorAvatar;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false, length = 3)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourseStatus status = CourseStatus.DRAFT;

    private boolean featured;

    @Column(name = "sort_order")
    private int sortOrder;

    @Column(name = "learning_outcomes", columnDefinition = "json")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String[] learningOutcomes;

    @Column(columnDefinition = "json")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String[] prerequisites;

    private String language = "English";

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CourseLevel level = CourseLevel.BEGINNER;

    @Column(name = "enrollment_count")
    private int enrollmentCount;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<CourseSection> sections = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Quiz> quizzes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Course() {
    }

    public Course(Long id, String title, String slug, String shortDescription, String description, String thumbnailUrl, String instructorName, String instructorBio, String instructorAvatar, Integer durationHours, BigDecimal price, BigDecimal originalPrice, String currency, CourseStatus status, boolean featured, int sortOrder, String[] learningOutcomes, String[] prerequisites, String language, CourseLevel level, int enrollmentCount, Long createdBy, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime publishedAt, List<CourseSection> sections, List<Quiz> quizzes) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.shortDescription = shortDescription;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.instructorName = instructorName;
        this.instructorBio = instructorBio;
        this.instructorAvatar = instructorAvatar;
        this.durationHours = durationHours;
        this.price = price;
        this.originalPrice = originalPrice;
        this.currency = currency;
        this.status = status;
        this.featured = featured;
        this.sortOrder = sortOrder;
        this.learningOutcomes = learningOutcomes;
        this.prerequisites = prerequisites;
        this.language = language;
        this.level = level;
        this.enrollmentCount = enrollmentCount;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.publishedAt = publishedAt;
        this.sections = sections;
        this.quizzes = quizzes;
    }

    public enum CourseStatus {
        DRAFT, PUBLISHED, ARCHIVED
    }

    public enum CourseLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}
