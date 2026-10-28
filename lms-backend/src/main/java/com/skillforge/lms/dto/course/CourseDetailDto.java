package com.skillforge.lms.dto.course;

import com.skillforge.lms.entity.Course;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Builder
public class CourseDetailDto {
    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private String description;
    private String thumbnailUrl;
    private String instructorName;
    private String instructorBio;
    private String instructorAvatar;
    private Integer durationHours;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String currency;
    private String status;
    private boolean featured;
    private String[] learningOutcomes;
    private String[] prerequisites;
    private String language;
    private String level;
    private int enrollmentCount;
    private boolean isEnrolled;
    private BigDecimal progressPct;
    @Builder.Default
    private List<CourseSectionDto> sections = new ArrayList<>();

    public CourseDetailDto() {
    }

    public CourseDetailDto(Long id, String title, String slug, String shortDescription, String description, String thumbnailUrl, String instructorName, String instructorBio, String instructorAvatar, Integer durationHours, BigDecimal price, BigDecimal originalPrice, String currency, String status, boolean featured, String[] learningOutcomes, String[] prerequisites, String language, String level, int enrollmentCount, boolean isEnrolled, BigDecimal progressPct, List<CourseSectionDto> sections) {
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
        this.learningOutcomes = learningOutcomes;
        this.prerequisites = prerequisites;
        this.language = language;
        this.level = level;
        this.enrollmentCount = enrollmentCount;
        this.isEnrolled = isEnrolled;
        this.progressPct = progressPct;
        this.sections = sections;
    }

    public static CourseDetailDto fromEntity(Course course, boolean hasAccess) {
        List<CourseSectionDto> sectionDtos = new ArrayList<>();
        if (course.getSections() != null) {
            for (var section : course.getSections()) {
                sectionDtos.add(CourseSectionDto.fromEntity(section, hasAccess));
            }
        }

        return CourseDetailDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .slug(course.getSlug())
                .shortDescription(course.getShortDescription())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .instructorName(course.getInstructorName())
                .instructorBio(course.getInstructorBio())
                .instructorAvatar(course.getInstructorAvatar())
                .durationHours(course.getDurationHours())
                .price(course.getPrice())
                .originalPrice(course.getOriginalPrice())
                .currency(course.getCurrency())
                .status(course.getStatus().name())
                .featured(course.isFeatured())
                .learningOutcomes(course.getLearningOutcomes())
                .prerequisites(course.getPrerequisites())
                .language(course.getLanguage())
                .level(course.getLevel().name())
                .enrollmentCount(course.getEnrollmentCount())
                .isEnrolled(hasAccess)
                .sections(sectionDtos)
                .build();
    }
}
