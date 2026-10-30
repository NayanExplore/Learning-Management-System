package com.skillforge.lms.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter @Setter
public class AppProperties {
    private String name;
    private String baseUrl;
    private String apiBaseUrl;
    private JwtProperties jwt = new JwtProperties();
    private CorsProperties cors = new CorsProperties();
    private RazorpayProperties razorpay = new RazorpayProperties();
    private AwsProperties aws = new AwsProperties();
    private EmailProperties email = new EmailProperties();
    private SmsProperties sms = new SmsProperties();
    private WhatsappProperties whatsapp = new WhatsappProperties();
    private CertificateProperties certificate = new CertificateProperties();
    private AdminProperties admin = new AdminProperties();

    @Getter @Setter
    public static class JwtProperties {
        private String secret;
        private long expirationMs = 86400000;
        private long refreshExpirationMs = 604800000;
        private String cookieName = "sf_token";
        private boolean cookieSecure = false;
        private String cookieDomain = "localhost";
    }

    @Getter @Setter
    public static class CorsProperties {
        private String allowedOrigins;
    }

    @Getter @Setter
    public static class RazorpayProperties {
        private String keyId;
        private String keySecret;
        private String webhookSecret;
        private String currency = "INR";
    }

    @Getter @Setter
    public static class AwsProperties {
        private String accessKey;
        private String secretKey;
        private String region = "ap-south-1";
        private S3Properties s3 = new S3Properties();

        @Getter @Setter
        public static class S3Properties {
            private String bucket;
            private int presignedUrlExpiryMinutes = 60;
        }
    }

    @Getter @Setter
    public static class EmailProperties {
        private String provider = "smtp";
        private String brevoApiKey;
        private String from;
        private String fromName;
    }

    @Getter @Setter
    public static class SmsProperties {
        private String provider = "msg91";
        private String msg91AuthKey;
        private String msg91TemplateId;
        private String msg91SenderId;
        private int otpExpirySeconds = 600;
        private int otpMaxAttempts = 3;
        private int otpResendCooldownSeconds = 60;
    }

    @Getter @Setter
    public static class WhatsappProperties {
        private String accessToken;
        private String phoneNumberId;
        private String apiVersion = "v18.0";
        private String verifyToken;
    }

    @Getter @Setter
    public static class CertificateProperties {
        private String storagePath = "certificates/";
        private String companyName = "SkillForge Academy";
        private String signatoryName;
        private String signatoryTitle = "Director of Education";
    }

    @Getter @Setter
    public static class AdminProperties {
        private String bootstrapEmail;
        private String bootstrapPassword;
    }
}
