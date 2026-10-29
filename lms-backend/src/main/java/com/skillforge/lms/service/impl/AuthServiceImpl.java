package com.skillforge.lms.service.impl;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.auth.*;
import com.skillforge.lms.entity.OtpRecord;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.exception.UnauthorizedException;
import com.skillforge.lms.repository.OtpRecordRepository;
import com.skillforge.lms.repository.UserRepository;
import com.skillforge.lms.security.JwtTokenProvider;
import com.skillforge.lms.security.UserPrincipal;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.NotificationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpRecordRepository otpRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;
    private final AppProperties appProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthServiceImpl(UserRepository userRepository, OtpRecordRepository otpRecordRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider, NotificationService notificationService, AppProperties appProperties) {
        this.userRepository = userRepository;
        this.otpRecordRepository = otpRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
        this.appProperties = appProperties;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .role(User.Role.STUDENT)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        setAuthCookie(response, token);

        // Send welcome email
        notificationService.sendEmail(user.getEmail(),
                "Welcome to SkillForge Academy!",
                String.format("<p>Hello %s,</p><p>Welcome to SkillForge Academy! Your account has been created successfully.</p>", user.getFullName()),
                "WELCOME_EMAIL", user);

        return AuthResponse.fromUser(user, token);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        setAuthCookie(response, token);

        return AuthResponse.fromUser(user, token);
    }

    @Override
    public void logout(HttpServletResponse response) {
        clearAuthCookie(response);
    }

    @Override
    @Transactional
    public String requestOtp(OtpRequestDto request) {
        OtpRecord.OtpPurpose purpose;
        try {
            purpose = OtpRecord.OtpPurpose.valueOf(request.getPurpose());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid OTP purpose: " + request.getPurpose());
        }

        LocalDateTime now = LocalDateTime.now();

        // Requirement 11: 60-second cooldown to prevent spamming
        int cooldownSeconds = Math.max(appProperties.getSms().getOtpResendCooldownSeconds(), 60);
        LocalDateTime cooldownThreshold = now.minusSeconds(cooldownSeconds);

        User user = null;
        if (StringUtils.hasText(request.getEmail())) {
            String email = request.getEmail().toLowerCase().trim();
            user = userRepository.findByEmail(email).orElse(null);

            // Requirement 3: Validate that email exists in users database for password reset
            if (purpose == OtpRecord.OtpPurpose.PASSWORD_RESET && user == null) {
                throw new BadRequestException("No registered account found with this email address. Please check your email or register.");
            }

            // Requirement 12: Rate limiting to prevent OTP abuse (maximum 5 requests per hour)
            long hourlyCount = otpRecordRepository.countByEmailAndPurposeAndCreatedAtAfter(email, purpose, now.minusHours(1));
            if (hourlyCount >= 5) {
                throw new BadRequestException("Too many verification requests for this email address. Please wait an hour before trying again.");
            }

            long recentCount = otpRecordRepository.countByEmailAndPurposeAndCreatedAtAfter(email, purpose, cooldownThreshold);
            if (recentCount > 0) {
                throw new BadRequestException("Please wait " + cooldownSeconds + " seconds before requesting a new verification code.");
            }
        } else if (StringUtils.hasText(request.getPhone())) {
            String phone = request.getPhone().trim();
            user = userRepository.findByPhone(phone).orElse(null);

            long hourlyCount = otpRecordRepository.countByPhoneAndPurposeAndCreatedAtAfter(phone, purpose, now.minusHours(1));
            if (hourlyCount >= 5) {
                throw new BadRequestException("Too many verification requests for this phone number. Please wait an hour before trying again.");
            }

            long recentCount = otpRecordRepository.countByPhoneAndPurposeAndCreatedAtAfter(phone, purpose, cooldownThreshold);
            if (recentCount > 0) {
                throw new BadRequestException("Please wait " + cooldownSeconds + " seconds before requesting a new verification code.");
            }
        } else {
            throw new BadRequestException("Either phone or email must be provided to request an OTP.");
        }

        // Requirement 4: Generate 6-digit cryptographically secure OTP
        int otpCode = 100000 + secureRandom.nextInt(900000);
        String otpString = String.valueOf(otpCode);

        log.info("================================================================");
        log.info("🔐 [OTP GENERATED] Target: {}, Purpose: {}, Code: [{}]",
                request.getEmail() != null ? request.getEmail() : request.getPhone(),
                purpose,
                otpString);
        log.info("================================================================");

        // Requirement 6: Expiry time of 10 minutes (600 seconds) & mapping
        int expirySeconds = (purpose == OtpRecord.OtpPurpose.PASSWORD_RESET) ? 600 : appProperties.getSms().getOtpExpirySeconds();

        OtpRecord otpRecord = OtpRecord.builder()
                .user(user)
                .email(request.getEmail() != null ? request.getEmail().toLowerCase().trim() : null)
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .otpHash(passwordEncoder.encode(otpString))
                .purpose(purpose)
                .attempts(0)
                .verified(false)
                .expiresAt(now.plusSeconds(expirySeconds))
                .build();

        otpRecordRepository.save(otpRecord);

        boolean emailConfigured = notificationService.isEmailConfigured();

        // Send OTP via Google SMTP email service
        if (StringUtils.hasText(request.getPhone())) {
            notificationService.sendSmsOtp(request.getPhone().trim(), otpString, user);
        } else if (StringUtils.hasText(request.getEmail())) {
            String recipientEmail = request.getEmail().toLowerCase().trim();
            String subject = purpose == OtpRecord.OtpPurpose.PASSWORD_RESET
                    ? "SkillForge - Password Reset Verification Code"
                    : "SkillForge - Email Verification Code";
            String actionTitle = purpose == OtpRecord.OtpPurpose.PASSWORD_RESET
                    ? "Reset Your Password"
                    : "Verify Your Email Address";
            String actionDesc = purpose == OtpRecord.OtpPurpose.PASSWORD_RESET
                    ? "We received a request to reset the password for your SkillForge account."
                    : "Thank you for joining SkillForge Academy. Please verify your email address to secure your account.";
            String validityText = (purpose == OtpRecord.OtpPurpose.PASSWORD_RESET)
                    ? "Valid for 10 minutes only &bull; Maximum 3 verification attempts"
                    : "Valid for 10 minutes only";

            String htmlBody = String.format("""
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 32px; color: #1e293b;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 800; font-size: 20px; padding: 10px 18px; border-radius: 12px; letter-spacing: -0.5px;">SkillForge Academy</div>
                    </div>
                    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 8px; text-align: center;">%s</h2>
                    <p style="font-size: 14px; color: #64748b; line-height: 1.6; text-align: center; margin-bottom: 24px;">%s</p>
                    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Your 6-Digit One-Time Code</span>
                        <span style="font-size: 36px; font-weight: 900; color: #4f46e5; letter-spacing: 8px; font-family: monospace;">%s</span>
                        <span style="font-size: 12px; color: #94a3b8; display: block; margin-top: 8px;">%s</span>
                    </div>
                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 8px;">If you did not request this verification code, you can safely ignore this email. No changes will be made to your account.</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                    <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">&copy; 2026 SkillForge Academy. All rights reserved.</p>
                </div>
                """, actionTitle, actionDesc, otpString, validityText);

            notificationService.sendEmail(recipientEmail, subject, htmlBody, "OTP_EMAIL", user);
        }

        // Return devOtp only if no email provider is configured, as a local development fallback.
        // When email is configured, never expose the OTP in the API response.
        return emailConfigured ? null : otpString;
    }

    @Override
    @Transactional
    public boolean verifyOtp(OtpVerifyDto request) {
        OtpRecord.OtpPurpose purpose;
        try {
            purpose = OtpRecord.OtpPurpose.valueOf(request.getPurpose());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid OTP purpose: " + request.getPurpose());
        }

        LocalDateTime now = LocalDateTime.now();
        OtpRecord record;

        if (StringUtils.hasText(request.getPhone())) {
            record = otpRecordRepository.findTopByPhoneAndPurposeAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                    request.getPhone().trim(), purpose, now)
                    .orElseThrow(() -> new BadRequestException("No active verification code found or code has expired."));
        } else if (StringUtils.hasText(request.getEmail())) {
            record = otpRecordRepository.findTopByEmailAndPurposeAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                    request.getEmail().toLowerCase().trim(), purpose, now)
                    .orElseThrow(() -> new BadRequestException("No active verification code found or code has expired."));
        } else {
            throw new BadRequestException("Either phone or email must be provided.");
        }

        // Requirement 6: Maximum 3 verification attempts
        int maxAttempts = 3;
        if (record.getAttempts() >= maxAttempts) {
            throw new BadRequestException("Maximum attempt limit (" + maxAttempts + " attempts) reached. This code is now invalid. Please request a new verification code.");
        }

        record.setAttempts(record.getAttempts() + 1);

        if (!passwordEncoder.matches(request.getOtp(), record.getOtpHash())) {
            otpRecordRepository.save(record);
            int remaining = maxAttempts - record.getAttempts();
            if (remaining <= 0) {
                throw new BadRequestException("Maximum attempt limit reached. This verification code has expired. Please request a new code.");
            }
            throw new BadRequestException("Invalid verification code. " + remaining + " attempt(s) remaining.");
        }

        record.setVerified(true);
        otpRecordRepository.save(record);

        // If user exists, update verified flag
        if (record.getUser() != null) {
            User u = record.getUser();
            if (purpose == OtpRecord.OtpPurpose.PHONE_VERIFY) {
                u.setPhoneVerified(true);
                userRepository.save(u);
            } else if (purpose == OtpRecord.OtpPurpose.EMAIL_VERIFY) {
                u.setEmailVerified(true);
                userRepository.save(u);
                notificationService.sendEmail(u.getEmail(),
                        "Your SkillForge Email Address is Verified",
                        String.format("""
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 32px; color: #1e293b;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <div style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 800; font-size: 20px; padding: 10px 18px; border-radius: 12px;">SkillForge Academy</div>
                            </div>
                            <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; text-align: center;">Email Verified Successfully!</h2>
                            <p style="font-size: 14px; color: #475569; line-height: 1.6;">Hello %s,</p>
                            <p style="font-size: 14px; color: #475569; line-height: 1.6;">Your email address <strong>%s</strong> has been successfully verified. You now have full access to your student dashboard, assessments, and verified credentials.</p>
                            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">&copy; 2026 SkillForge Academy. All rights reserved.</p>
                        </div>
                        """, u.getFullName() != null ? u.getFullName() : "Learner", u.getEmail()),
                        "EMAIL_VERIFY_SUCCESS", u);
            }
        }

        return true;
    }

    @Override
    @Transactional
    public void resetPassword(PasswordResetConfirmDto request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No registered account found with this email address."));

        // Requirement 8: Enforce password rules (minimum 8 characters, uppercase, lowercase, number, special character)
        validatePasswordStrength(request.getNewPassword());

        LocalDateTime now = LocalDateTime.now();

        // Check if there is an active OTP record for PASSWORD_RESET within 10 minutes
        OtpRecord record = otpRecordRepository.findTopByEmailAndPurposeAndExpiresAtAfterOrderByCreatedAtDesc(
                email, OtpRecord.OtpPurpose.PASSWORD_RESET, now)
                .orElseThrow(() -> new BadRequestException("No active verification session found or code has expired. Please request a new code."));

        // If not already verified via /otp/verify step, verify it now with 3 max attempts
        if (!record.isVerified()) {
            int maxAttempts = 3;
            if (record.getAttempts() >= maxAttempts) {
                throw new BadRequestException("Maximum attempt limit reached. This verification code has expired. Please request a new code.");
            }
            record.setAttempts(record.getAttempts() + 1);
            if (!passwordEncoder.matches(request.getOtp(), record.getOtpHash())) {
                otpRecordRepository.save(record);
                int remaining = maxAttempts - record.getAttempts();
                if (remaining <= 0) {
                    throw new BadRequestException("Maximum attempt limit reached. This verification code has expired. Please request a new code.");
                }
                throw new BadRequestException("Invalid verification code. " + remaining + " attempt(s) remaining.");
            }
            record.setVerified(true);
            otpRecordRepository.save(record);
        }

        // Requirement 9: Hash the new password before saving it to the database
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Requirement 10: Invalidate the OTP after successful password reset
        List<OtpRecord> allActiveOtps = otpRecordRepository.findAllByEmailAndPurpose(email, OtpRecord.OtpPurpose.PASSWORD_RESET);
        for (OtpRecord otp : allActiveOtps) {
            otp.setExpiresAt(now.minusSeconds(1));
            otp.setVerified(true);
        }
        otpRecordRepository.saveAll(allActiveOtps);

        notificationService.sendEmail(user.getEmail(),
                "Your SkillForge Password Was Reset Successfully",
                String.format("""
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 32px; color: #1e293b;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 800; font-size: 20px; padding: 10px 18px; border-radius: 12px;">SkillForge Academy</div>
                    </div>
                    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; text-align: center;">Password Reset Confirmed</h2>
                    <p style="font-size: 14px; color: #475569; line-height: 1.6;">Hello %s,</p>
                    <p style="font-size: 14px; color: #475569; line-height: 1.6;">Your SkillForge account password has been successfully reset. You can now log in with your new password.</p>
                    <p style="font-size: 13px; color: #e11d48; line-height: 1.5; font-weight: 600;">If you did not initiate this change, please contact our support team immediately.</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                    <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">&copy; 2026 SkillForge Academy. All rights reserved.</p>
                </div>
                """, user.getFullName() != null ? user.getFullName() : "Learner"),
                "PASSWORD_RESET_SUCCESS", user);
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters long.");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new BadRequestException("Password must contain at least one uppercase letter (A-Z).");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new BadRequestException("Password must contain at least one lowercase letter (a-z).");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new BadRequestException("Password must contain at least one number (0-9).");
        }
        if (!password.matches(".*[@$!%*?&#^()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new BadRequestException("Password must contain at least one special character (!@#$%^&*...).");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("You must be logged in to perform this operation.");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));
    }

    @Override
    public void setAuthCookie(HttpServletResponse response, String token) {
        var jwtConfig = appProperties.getJwt();
        boolean secure = jwtConfig.isCookieSecure();
        String sameSite = secure ? "None" : "Lax";
        ResponseCookie cookie = ResponseCookie.from(jwtConfig.getCookieName(), token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(jwtConfig.getExpirationMs() / 1000)
                .sameSite(sameSite)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @Override
    public void clearAuthCookie(HttpServletResponse response) {
        var jwtConfig = appProperties.getJwt();
        boolean secure = jwtConfig.isCookieSecure();
        String sameSite = secure ? "None" : "Lax";
        ResponseCookie cookie = ResponseCookie.from(jwtConfig.getCookieName(), "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
