package com.skillforge.lms.controller;

import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/public")
@Tag(name = "Public Metadata", description = "Public branding, marketing configurations, and contact form")
public class PublicController {

    private final NotificationService notificationService;

    public PublicController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/settings")
    @Operation(summary = "Get public website configuration and branding")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPublicSettings() {
        Map<String, String> settings = Map.of(
                "siteName", "SkillForge Academy",
                "tagline", "Master New Skills, Transform Your Career",
                "contactEmail", "hello@skillforge.com",
                "contactPhone", "+91 98765 43210",
                "contactAddress", "Koramangala, Bangalore, Karnataka 560034",
                "currency", "INR",
                "currencySymbol", "₹"
        );
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PostMapping("/contact")
    @Operation(summary = "Send contact form message")
    public ResponseEntity<ApiResponse<Void>> sendContactMessage(@RequestBody ContactRequest request) {
        String html = String.format("<p>New Contact Message from %s (%s):</p><p>%s</p>",
                request.getName(), request.getEmail(), request.getMessage());
        notificationService.sendEmail("hello@skillforge.com", "Contact Message: " + request.getSubject(), html, "CONTACT_FORM", null);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully. Our team will contact you shortly.", null));
    }

    @Getter @Setter
    public static class ContactRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        private String subject = "General Inquiry";
        @NotBlank private String message;
    }
}
