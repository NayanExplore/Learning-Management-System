package com.skillforge.lms.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OtpRequestDto {
    private String phone;
    private String email;
    @NotBlank(message = "Purpose is required")
    private String purpose; // PHONE_VERIFY, EMAIL_VERIFY, PASSWORD_RESET, LOGIN
}
