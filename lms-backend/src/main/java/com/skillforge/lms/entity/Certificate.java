package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"}))
@Getter @Setter
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_id", nullable = false, unique = true)
    private String certificateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "course_title", nullable = false)
    private String courseTitle;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "file_key")
    private String fileKey;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (issueDate == null) issueDate = LocalDate.now();
    }

    public Certificate() {
    }

    public Certificate(Long id, String certificateId, User user, Course course, Enrollment enrollment, String studentName, String courseTitle, LocalDate issueDate, String fileKey, String fileUrl, LocalDateTime createdAt) {
        this.id = id;
        this.certificateId = certificateId;
        this.user = user;
        this.course = course;
        this.enrollment = enrollment;
        this.studentName = studentName;
        this.courseTitle = courseTitle;
        this.issueDate = issueDate;
        this.fileKey = fileKey;
        this.fileUrl = fileUrl;
        this.createdAt = createdAt;
    }
}
