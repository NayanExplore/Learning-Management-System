package com.skillforge.lms.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PasswordResetRequestDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;
}
