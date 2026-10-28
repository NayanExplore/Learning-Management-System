package com.skillforge.lms.service;

import com.skillforge.lms.entity.User;
import java.util.Map;

public interface NotificationService {
    void sendEmail(String to, String subject, String bodyHtml, String templateName, User user);
    void sendSmsOtp(String phone, String otp, User user);
    void sendWhatsAppMessage(String phone, String templateName, Map<String, String> params, User user);
    void sendOrderConfirmation(User user, String courseTitle, String orderNumber, String amount);
    void sendCertificateIssuedNotification(User user, String courseTitle, String certificateId);
    boolean isEmailConfigured();
}
