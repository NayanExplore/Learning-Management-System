package com.skillforge.lms.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ManualEnrollmentRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    private Long userId;

    private String email;

    public ManualEnrollmentRequest() {
    }

    public ManualEnrollmentRequest(Long courseId, Long userId, String email) {
        this.courseId = courseId;
        this.userId = userId;
        this.email = email;
    }
}
