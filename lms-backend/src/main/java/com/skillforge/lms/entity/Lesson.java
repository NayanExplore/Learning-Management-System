package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Getter @Setter
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private CourseSection section;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 20)
    private ContentType contentType = ContentType.VIDEO;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "video_duration_seconds")
    private Integer videoDurationSeconds;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(name = "sort_order")
    private int sortOrder;

    @Column(name = "is_preview")
    private boolean preview;

    @Column(name = "is_mandatory")
    private boolean mandatory = true;

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

    public Lesson() {
    }

    public Lesson(Long id, CourseSection section, Course course, String title, String description, ContentType contentType, String videoUrl, Integer videoDurationSeconds, String contentText, int sortOrder, boolean preview, boolean mandatory, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.section = section;
        this.course = course;
        this.title = title;
        this.description = description;
        this.contentType = contentType;
        this.videoUrl = videoUrl;
        this.videoDurationSeconds = videoDurationSeconds;
        this.contentText = contentText;
        this.sortOrder = sortOrder;
        this.preview = preview;
        this.mandatory = mandatory;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public enum ContentType {
        VIDEO, TEXT, PDF, RESOURCE
    }
}
