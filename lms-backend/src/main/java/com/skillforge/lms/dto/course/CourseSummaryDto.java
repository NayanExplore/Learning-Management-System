package com.skillforge.lms.dto.course;

import com.skillforge.lms.entity.Course;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@Builder
public class CourseSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private String thumbnailUrl;
    private String instructorName;
    private Integer durationHours;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String currency;
    private String status;
    private boolean featured;
    private String level;
    private int enrollmentCount;

    public CourseSummaryDto() {
    }

    public CourseSummaryDto(Long id, String title, String slug, String shortDescription, String thumbnailUrl, String instructorName, Integer durationHours, BigDecimal price, BigDecimal originalPrice, String currency, String status, boolean featured, String level, int enrollmentCount) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.shortDescription = shortDescription;
        this.thumbnailUrl = thumbnailUrl;
        this.instructorName = instructorName;
        this.durationHours = durationHours;
        this.price = price;
        this.originalPrice = originalPrice;
        this.currency = currency;
        this.status = status;
        this.featured = featured;
        this.level = level;
        this.enrollmentCount = enrollmentCount;
    }

    public static CourseSummaryDto fromEntity(Course course) {
        return CourseSummaryDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .slug(course.getSlug())
                .shortDescription(course.getShortDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .instructorName(course.getInstructorName())
                .durationHours(course.getDurationHours())
                .price(course.getPrice())
                .originalPrice(course.getOriginalPrice())
                .currency(course.getCurrency())
                .status(course.getStatus().name())
                .featured(course.isFeatured())
                .level(course.getLevel().name())
                .enrollmentCount(course.getEnrollmentCount())
                .build();
    }
}
