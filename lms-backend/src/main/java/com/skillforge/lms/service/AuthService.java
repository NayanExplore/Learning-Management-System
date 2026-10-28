package com.skillforge.lms.service;

import com.skillforge.lms.dto.auth.*;
import com.skillforge.lms.entity.User;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request, HttpServletResponse response);
    AuthResponse login(LoginRequest request, HttpServletResponse response);
    void logout(HttpServletResponse response);
    String requestOtp(OtpRequestDto request);
    boolean verifyOtp(OtpVerifyDto request);
    void resetPassword(PasswordResetConfirmDto request);
    User getCurrentUser();
    void setAuthCookie(HttpServletResponse response, String token);
    void clearAuthCookie(HttpServletResponse response);
}
