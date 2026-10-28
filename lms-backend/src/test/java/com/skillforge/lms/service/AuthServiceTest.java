package com.skillforge.lms.service;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.auth.LoginRequest;
import com.skillforge.lms.dto.auth.OtpRequestDto;
import com.skillforge.lms.dto.auth.OtpVerifyDto;
import com.skillforge.lms.dto.auth.RegisterRequest;
import com.skillforge.lms.entity.OtpRecord;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.UnauthorizedException;
import com.skillforge.lms.repository.OtpRecordRepository;
import com.skillforge.lms.repository.UserRepository;
import com.skillforge.lms.security.JwtTokenProvider;
import com.skillforge.lms.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private OtpRecordRepository otpRecordRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AppProperties appProperties;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private AppProperties.SmsProperties smsProps;
    private AppProperties.JwtProperties jwtProps;

    @BeforeEach
    void setUp() {
        smsProps = new AppProperties.SmsProperties();
        smsProps.setOtpExpirySeconds(300);
        smsProps.setOtpMaxAttempts(5);
        smsProps.setOtpResendCooldownSeconds(30);

        jwtProps = new AppProperties.JwtProperties();
        jwtProps.setCookieName("sf_token");
        jwtProps.setExpirationMs(3600000);

        lenient().when(appProperties.getSms()).thenReturn(smsProps);
        lenient().when(appProperties.getJwt()).thenReturn(jwtProps);

        sampleUser = User.builder()
                .id(1L)
                .email("student@test.com")
                .passwordHash("hashed_pw")
                .fullName("Test Student")
                .role(User.Role.STUDENT)
                .enabled(true)
                .build();
    }

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@test.com");
        req.setPassword("Password123!");
        req.setFullName("New User");

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_new_pw");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateToken(any(), any(), any())).thenReturn("mock.jwt.token");

        MockHttpServletResponse response = new MockHttpServletResponse();
        var authRes = authService.register(req, response);

        assertNotNull(authRes);
        assertEquals("student@test.com", authRes.getEmail());
        verify(userRepository).save(any(User.class));
        verify(notificationService).sendEmail(any(), any(), any(), any(), any());
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequest() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@test.com");
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        MockHttpServletResponse response = new MockHttpServletResponse();
        assertThrows(BadRequestException.class, () -> authService.register(req, response));
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("student@test.com");
        req.setPassword("CorrectPassword");

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("CorrectPassword", "hashed_pw")).thenReturn(true);
        when(tokenProvider.generateToken(any(), any(), any())).thenReturn("mock.jwt.token");

        MockHttpServletResponse response = new MockHttpServletResponse();
        var authRes = authService.login(req, response);

        assertNotNull(authRes);
        assertEquals("Test Student", authRes.getFullName());
    }

    @Test
    void login_WrongPassword_ThrowsUnauthorized() {
        LoginRequest req = new LoginRequest();
        req.setEmail("student@test.com");
        req.setPassword("WrongPassword");

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", "hashed_pw")).thenReturn(false);

        MockHttpServletResponse response = new MockHttpServletResponse();
        assertThrows(UnauthorizedException.class, () -> authService.login(req, response));
    }

    @Test
    void requestOtp_CooldownActive_ThrowsBadRequest() {
        OtpRequestDto req = new OtpRequestDto();
        req.setEmail("student@test.com");
        req.setPurpose("EMAIL_VERIFY");

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(sampleUser));
        when(otpRecordRepository.countByEmailAndPurposeAndCreatedAtAfter(any(), any(), any())).thenReturn(1L);

        assertThrows(BadRequestException.class, () -> authService.requestOtp(req));
    }

    @Test
    void requestOtp_UserNotFound_PasswordReset_ThrowsBadRequest() {
        OtpRequestDto req = new OtpRequestDto();
        req.setEmail("unregistered@test.com");
        req.setPurpose("PASSWORD_RESET");

        when(userRepository.findByEmail("unregistered@test.com")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> authService.requestOtp(req));
    }

    @Test
    void requestOtp_RateLimitExceeded_ThrowsBadRequest() {
        OtpRequestDto req = new OtpRequestDto();
        req.setEmail("student@test.com");
        req.setPurpose("PASSWORD_RESET");

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(sampleUser));
        when(otpRecordRepository.countByEmailAndPurposeAndCreatedAtAfter(eq("student@test.com"), eq(OtpRecord.OtpPurpose.PASSWORD_RESET), any()))
                .thenReturn(5L);

        assertThrows(BadRequestException.class, () -> authService.requestOtp(req));
    }

    @Test
    void resetPassword_WeakPassword_ThrowsBadRequest() {
        com.skillforge.lms.dto.auth.PasswordResetConfirmDto req = new com.skillforge.lms.dto.auth.PasswordResetConfirmDto();
        req.setEmail("student@test.com");
        req.setOtp("123456");
        req.setNewPassword("simple");

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(sampleUser));

        assertThrows(BadRequestException.class, () -> authService.resetPassword(req));
    }

    @Test
    void resetPassword_Success() {
        com.skillforge.lms.dto.auth.PasswordResetConfirmDto req = new com.skillforge.lms.dto.auth.PasswordResetConfirmDto();
        req.setEmail("student@test.com");
        req.setOtp("123456");
        req.setNewPassword("StrongPassword123!");

        OtpRecord activeOtp = OtpRecord.builder()
                .attempts(0)
                .otpHash("encoded_hash")
                .verified(false)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(sampleUser));
        when(otpRecordRepository.findTopByEmailAndPurposeAndExpiresAtAfterOrderByCreatedAtDesc(
                eq("student@test.com"), eq(OtpRecord.OtpPurpose.PASSWORD_RESET), any()))
                .thenReturn(Optional.of(activeOtp));
        when(passwordEncoder.matches("123456", "encoded_hash")).thenReturn(true);
        when(passwordEncoder.encode("StrongPassword123!")).thenReturn("new_encoded_hash");
        when(otpRecordRepository.findAllByEmailAndPurpose("student@test.com", OtpRecord.OtpPurpose.PASSWORD_RESET))
                .thenReturn(java.util.List.of(activeOtp));

        authService.resetPassword(req);

        assertEquals("new_encoded_hash", sampleUser.getPasswordHash());
        verify(userRepository).save(sampleUser);
        verify(notificationService).sendEmail(eq("student@test.com"), anyString(), anyString(), eq("PASSWORD_RESET_SUCCESS"), eq(sampleUser));
        assertTrue(activeOtp.isVerified());
    }
}
