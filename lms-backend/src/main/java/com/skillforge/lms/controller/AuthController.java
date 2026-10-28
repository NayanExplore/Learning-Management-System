package com.skillforge.lms.controller;

import com.skillforge.lms.dto.auth.*;
import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/v1/auth", "/auth"})
@Tag(name = "Authentication", description = "Endpoints for registration, login, OTP verification, and password reset")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new student account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request, response);
        return ResponseEntity.ok(ApiResponse.success("Account registered successfully", authResponse));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request, response);
        return ResponseEntity.ok(ApiResponse.success("Logged in successfully", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and clear authentication cookies")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        User user = authService.getCurrentUser();
        AuthResponse authResponse = AuthResponse.fromUser(user, null);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/otp/request")
    @Operation(summary = "Request an OTP verification code via SMS or Email")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> requestOtp(@Valid @RequestBody OtpRequestDto request) {
        String devOtp = authService.requestOtp(request);
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        if (devOtp != null) {
            data.put("devOtp", devOtp);
            return ResponseEntity.ok(ApiResponse.<java.util.Map<String, Object>>builder()
                    .success(true)
                    .message("Verification code generated (Dev Mode: OTP is " + devOtp + ")")
                    .data(data)
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.<java.util.Map<String, Object>>builder()
                .success(true)
                .message("Verification code sent successfully")
                .data(data)
                .build());
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password - generate and dispatch reset OTP via email")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> forgotPassword(@Valid @RequestBody PasswordResetRequestDto request) {
        OtpRequestDto otpDto = new OtpRequestDto();
        otpDto.setEmail(request.getEmail());
        otpDto.setPurpose("PASSWORD_RESET");

        try {
            String devOtp = authService.requestOtp(otpDto);
            java.util.Map<String, Object> data = new java.util.HashMap<>();
            if (devOtp != null) {
                data.put("devOtp", devOtp);
            }
            return ResponseEntity.ok(ApiResponse.<java.util.Map<String, Object>>builder()
                    .success(true)
                    .message("If an account exists with this email, a verification code has been sent.")
                    .data(data)
                    .build());
        } catch (com.skillforge.lms.exception.BadRequestException ex) {
            // Prevent email enumeration for user-facing forgot password endpoint
            if (ex.getMessage() != null && ex.getMessage().contains("No registered account found")) {
                return ResponseEntity.ok(ApiResponse.<java.util.Map<String, Object>>builder()
                        .success(true)
                        .message("If an account exists with this email, a verification code has been sent.")
                        .data(java.util.Map.of())
                        .build());
            }
            throw ex;
        }
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify an OTP code")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@Valid @RequestBody OtpVerifyDto request) {
        boolean verified = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Verification successful", verified));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP for password reset")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtpSimple(@Valid @RequestBody VerifyOtpSimpleRequest request) {
        OtpVerifyDto verifyDto = new OtpVerifyDto();
        verifyDto.setEmail(request.getEmail());
        verifyDto.setOtp(request.getOtp());
        verifyDto.setPurpose("PASSWORD_RESET");
        boolean verified = authService.verifyOtp(verifyDto);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", verified));
    }

    @PostMapping(value = {"/password/reset-confirm", "/reset-password"})
    @Operation(summary = "Reset password using verified OTP code")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody PasswordResetConfirmDto request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully. You can now login.", null));
    }
}
