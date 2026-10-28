package com.skillforge.lms.dto.admin;

import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.Enrollment;
import com.skillforge.lms.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class AdminEnrollmentDto {
    private Long id;
    private StudentInfo student;
    private CourseInfo course;
    private String status;
    private BigDecimal progressPct;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;

    public AdminEnrollmentDto() {
    }

    @Builder
    public AdminEnrollmentDto(Long id, StudentInfo student, CourseInfo course, String status, BigDecimal progressPct, LocalDateTime enrolledAt, LocalDateTime completedAt) {
        this.id = id;
        this.student = student;
        this.course = course;
        this.status = status;
        this.progressPct = progressPct;
        this.enrolledAt = enrolledAt;
        this.completedAt = completedAt;
    }

    @Getter
    @Setter
    public static class StudentInfo {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String avatarUrl;
        private boolean enabled;
        private LocalDateTime createdAt;

        public StudentInfo() {
        }

        @Builder
        public StudentInfo(Long id, String fullName, String email, String phone, String avatarUrl, boolean enabled, LocalDateTime createdAt) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phone = phone;
            this.avatarUrl = avatarUrl;
            this.enabled = enabled;
            this.createdAt = createdAt;
        }

        public static StudentInfo fromEntity(User user) {
            if (user == null) return null;
            return StudentInfo.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .avatarUrl(user.getAvatarUrl())
                    .enabled(user.isEnabled())
                    .createdAt(user.getCreatedAt())
                    .build();
        }
    }

    @Getter
    @Setter
    public static class CourseInfo {
        private Long id;
        private String title;
        private String slug;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private String currency;
        private String level;
        private Integer durationHours;
        private String thumbnailUrl;
        private String instructorName;

        public CourseInfo() {
        }

        @Builder
        public CourseInfo(Long id, String title, String slug, BigDecimal price, BigDecimal originalPrice, String currency, String level, Integer durationHours, String thumbnailUrl, String instructorName) {
            this.id = id;
            this.title = title;
            this.slug = slug;
            this.price = price;
            this.originalPrice = originalPrice;
            this.currency = currency;
            this.level = level;
            this.durationHours = durationHours;
            this.thumbnailUrl = thumbnailUrl;
            this.instructorName = instructorName;
        }

        public static CourseInfo fromEntity(Course course) {
            if (course == null) return null;
            return CourseInfo.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .slug(course.getSlug())
                    .price(course.getPrice())
                    .originalPrice(course.getOriginalPrice())
                    .currency(course.getCurrency())
                    .level(course.getLevel() != null ? course.getLevel().name() : null)
                    .durationHours(course.getDurationHours())
                    .thumbnailUrl(course.getThumbnailUrl())
                    .instructorName(course.getInstructorName())
                    .build();
        }
    }

    public static AdminEnrollmentDto fromEntity(Enrollment enrollment) {
        if (enrollment == null) return null;
        return AdminEnrollmentDto.builder()
                .id(enrollment.getId())
                .student(StudentInfo.fromEntity(enrollment.getUser()))
                .course(CourseInfo.fromEntity(enrollment.getCourse()))
                .status(enrollment.getStatus() != null ? enrollment.getStatus().name() : "ACTIVE")
                .progressPct(enrollment.getProgressPct() != null ? enrollment.getProgressPct() : BigDecimal.ZERO)
                .enrolledAt(enrollment.getEnrolledAt())
                .completedAt(enrollment.getCompletedAt())
                .build();
    }
}
