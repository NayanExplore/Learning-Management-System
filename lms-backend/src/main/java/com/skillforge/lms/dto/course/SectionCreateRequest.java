package com.skillforge.lms.dto.course;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SectionCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private int sortOrder;
}
