package com.skillforge.lms.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OtpVerifyDto {
    private String phone;
    private String email;
    @NotBlank(message = "OTP is required")
    private String otp;
    @NotBlank(message = "Purpose is required")
    private String purpose;
}
