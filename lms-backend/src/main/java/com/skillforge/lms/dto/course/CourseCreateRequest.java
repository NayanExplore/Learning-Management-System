package com.skillforge.lms.dto.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter @Setter
public class CourseCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String slug;
    private String shortDescription;
    private String description;
    private String thumbnailUrl;
    private String instructorName;
    private String instructorBio;
    private Integer durationHours;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price cannot be negative")
    private BigDecimal price;

    private BigDecimal originalPrice;
    private String currency = "INR";
    private String status = "DRAFT";
    private boolean featured;
    private String[] learningOutcomes;
    private String[] prerequisites;
    private String language = "English";
    private String level = "BEGINNER";
}
