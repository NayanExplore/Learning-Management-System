package com.skillforge.lms.dto.course;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LessonCreateRequest {
    @NotBlank(message = "Lesson title is required")
    private String title;
    private String description;
    private String contentType = "VIDEO";
    private String videoUrl;
    private Integer videoDurationSeconds;
    private String contentText;
    private int sortOrder;
    private boolean preview;
    private boolean mandatory = true;
}
