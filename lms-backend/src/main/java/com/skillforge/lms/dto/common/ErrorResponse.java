package com.skillforge.lms.dto.common;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

@Getter @Setter
@Builder
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private Map<String, String> validationErrors;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse() {
    }

    public ErrorResponse(int status, String error, String message, Map<String, String> validationErrors, LocalDateTime timestamp) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.validationErrors = validationErrors;
        this.timestamp = timestamp;
    }
}
