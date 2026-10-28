package com.skillforge.lms.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class UserPrincipal {
    private Long id;
    private String email;
    private String role;

    public UserPrincipal(Long id, String email, String role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }
}
