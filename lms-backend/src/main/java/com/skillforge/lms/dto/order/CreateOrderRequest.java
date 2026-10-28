package com.skillforge.lms.dto.order;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateOrderRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;
}
