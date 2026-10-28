package com.skillforge.lms.dto.auth;

import com.skillforge.lms.entity.User;
import lombok.*;

@Getter @Setter
@Builder
public class AuthResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private boolean emailVerified;
    private boolean phoneVerified;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String email, String fullName, String phone, String role, boolean emailVerified, boolean phoneVerified, String token) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.emailVerified = emailVerified;
        this.phoneVerified = phoneVerified;
        this.token = token;
    }

    public static AuthResponse fromUser(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .token(token)
                .build();
    }
}
