package com.skillforge.lms.service.impl;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.certificate.CertificateDto;
import com.skillforge.lms.dto.certificate.CertificateVerifyResponseDto;
import com.skillforge.lms.entity.Certificate;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.Enrollment;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.ForbiddenException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.CertificateRepository;
import com.skillforge.lms.repository.EnrollmentRepository;
import com.skillforge.lms.service.CertificateService;
import com.skillforge.lms.service.FileStorageService;
import com.skillforge.lms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    private final AppProperties appProperties;

    public CertificateServiceImpl(CertificateRepository certificateRepository, EnrollmentRepository enrollmentRepository, FileStorageService fileStorageService, NotificationService notificationService, AppProperties appProperties) {
        this.certificateRepository = certificateRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
        this.appProperties = appProperties;
    }

    @Override
    @Transactional
    public Certificate issueCertificate(User user, Course course) {
        // Prevent duplicate certificate issuance
        var existing = certificateRepository.findByUserIdAndCourseId(user.getId(), course.getId());
        if (existing.isPresent()) {
            log.info("Certificate already exists for user {} and course {}", user.getId(), course.getId());
            return existing.get();
        }

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId()).orElse(null);

        // Generate unique certificate ID: SF-YYYYMMDD-XXXXXX
        String certId = "SF-" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + "-" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        LocalDate issueDate = LocalDate.now();

        Certificate certificate = Certificate.builder()
                .certificateId(certId)
                .user(user)
                .course(course)
                .enrollment(enrollment)
                .studentName(user.getFullName())
                .courseTitle(course.getTitle())
                .issueDate(issueDate)
                .build();

        // Generate PDF bytes
        byte[] pdfBytes = generatePdfBytes(certificate);
        String storageKey = "certificates/" + certId + ".pdf";

        fileStorageService.uploadFile(storageKey, new ByteArrayInputStream(pdfBytes), pdfBytes.length, "application/pdf");
        String presignedUrl = fileStorageService.getPresignedUrl(storageKey);

        certificate.setFileKey(storageKey);
        certificate.setFileUrl(presignedUrl);

        certificate = certificateRepository.save(certificate);
        log.info("Successfully issued certificate {} to student {}", certId, user.getEmail());

        // Send notification
        notificationService.sendCertificateIssuedNotification(user, course.getTitle(), certId);

        return certificate;
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateVerifyResponseDto verifyCertificate(String certificateId) {
        return certificateRepository.findByCertificateId(certificateId.trim())
                .map(c -> CertificateVerifyResponseDto.builder()
                        .valid(true)
                        .certificateId(c.getCertificateId())
                        .studentName(c.getStudentName())
                        .courseTitle(c.getCourseTitle())
                        .issueDate(c.getIssueDate())
                        .issuer(appProperties.getCertificate().getCompanyName())
                        .build())
                .orElse(CertificateVerifyResponseDto.builder()
                        .valid(false)
                        .certificateId(certificateId)
                        .issuer(appProperties.getCertificate().getCompanyName())
                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadCertificatePdf(String certificateId, User currentUser) {
        Certificate cert = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", certificateId));

        if (currentUser.getRole() != User.Role.ADMIN && !cert.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to download this certificate.");
        }

        byte[] bytes = fileStorageService.getFileBytes(cert.getFileKey());
        if (bytes == null || bytes.length == 0) {
            // Re-generate if not in storage
            bytes = generatePdfBytes(cert);
            fileStorageService.uploadFile(cert.getFileKey(), new ByteArrayInputStream(bytes), bytes.length, "application/pdf");
        }
        return bytes;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificateDto> getUserCertificates(User user) {
        return certificateRepository.findByUserId(user.getId())
                .stream()
                .map(CertificateDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CertificateDto> getUserCertificatesPaged(User user, Pageable pageable) {
        return certificateRepository.findByUserId(user.getId(), pageable)
                .map(CertificateDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Certificate getCertificateByCourseAndUser(Long courseId, Long userId) {
        return certificateRepository.findByUserIdAndCourseId(userId, courseId).orElse(null);
    }

    private byte[] generatePdfBytes(Certificate cert) {
        try (PDDocument document = new PDDocument()) {
            // Landscape A4 Page
            PDPage page = new PDPage(new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()));
            document.addPage(page);

            float pageWidth = page.getMediaBox().getWidth();
            float pageHeight = page.getMediaBox().getHeight();

            PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font subFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                // Outer decorative border
                cs.setLineWidth(4f);
                cs.setStrokingColor(79 / 255f, 70 / 255f, 229 / 255f); // Primary Indigo #4F46E5
                cs.addRect(30, 30, pageWidth - 60, pageHeight - 60);
                cs.stroke();

                // Inner thin border
                cs.setLineWidth(1f);
                cs.setStrokingColor(203 / 255f, 213 / 255f, 225 / 255f);
                cs.addRect(38, 38, pageWidth - 76, pageHeight - 76);
                cs.stroke();

                // Organization Brand Name
                cs.beginText();
                cs.setFont(titleFont, 24);
                cs.setNonStrokingColor(30 / 255f, 41 / 255f, 59 / 255f);
                float brandWidth = titleFont.getStringWidth(appProperties.getCertificate().getCompanyName()) / 1000 * 24;
                cs.newLineAtOffset((pageWidth - brandWidth) / 2, pageHeight - 100);
                cs.showText(appProperties.getCertificate().getCompanyName());
                cs.endText();

                // Certificate Header
                cs.beginText();
                cs.setFont(titleFont, 16);
                cs.setNonStrokingColor(79 / 255f, 70 / 255f, 229 / 255f);
                String certHeading = "CERTIFICATE OF COMPLETION";
                float headingWidth = titleFont.getStringWidth(certHeading) / 1000 * 16;
                cs.newLineAtOffset((pageWidth - headingWidth) / 2, pageHeight - 140);
                cs.showText(certHeading);
                cs.endText();

                // "This is proudly presented to"
                cs.beginText();
                cs.setFont(subFont, 13);
                cs.setNonStrokingColor(100 / 255f, 116 / 255f, 139 / 255f);
                String presentedText = "This is to certify that";
                float presWidth = subFont.getStringWidth(presentedText) / 1000 * 13;
                cs.newLineAtOffset((pageWidth - presWidth) / 2, pageHeight - 180);
                cs.showText(presentedText);
                cs.endText();

                // Student Full Name
                cs.beginText();
                cs.setFont(titleFont, 30);
                cs.setNonStrokingColor(15 / 255f, 23 / 255f, 42 / 255f);
                float nameWidth = titleFont.getStringWidth(cert.getStudentName()) / 1000 * 30;
                cs.newLineAtOffset((pageWidth - nameWidth) / 2, pageHeight - 230);
                cs.showText(cert.getStudentName());
                cs.endText();

                // "has successfully completed"
                cs.beginText();
                cs.setFont(subFont, 13);
                cs.setNonStrokingColor(100 / 255f, 116 / 255f, 139 / 255f);
                String completedText = "has successfully completed all requirements and assessments for the course";
                float compWidth = subFont.getStringWidth(completedText) / 1000 * 13;
                cs.newLineAtOffset((pageWidth - compWidth) / 2, pageHeight - 270);
                cs.showText(completedText);
                cs.endText();

                // Course Title
                cs.beginText();
                cs.setFont(titleFont, 22);
                cs.setNonStrokingColor(79 / 255f, 70 / 255f, 229 / 255f);
                float courseWidth = titleFont.getStringWidth(cert.getCourseTitle()) / 1000 * 22;
                cs.newLineAtOffset((pageWidth - courseWidth) / 2, pageHeight - 310);
                cs.showText(cert.getCourseTitle());
                cs.endText();

                // Issue Date & Certificate ID
                String issueDateFormatted = cert.getIssueDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));

                // Date Block (Left)
                cs.beginText();
                cs.setFont(boldFont, 11);
                cs.setNonStrokingColor(30 / 255f, 41 / 255f, 59 / 255f);
                cs.newLineAtOffset(80, 110);
                cs.showText("Date Issued: " + issueDateFormatted);
                cs.endText();

                cs.beginText();
                cs.setFont(subFont, 10);
                cs.setNonStrokingColor(100 / 255f, 116 / 255f, 139 / 255f);
                cs.newLineAtOffset(80, 95);
                cs.showText("Certificate ID: " + cert.getCertificateId());
                cs.endText();

                // Signatory Block (Right)
                cs.setLineWidth(1f);
                cs.setStrokingColor(100 / 255f, 116 / 255f, 139 / 255f);
                cs.moveTo(pageWidth - 280, 120);
                cs.lineTo(pageWidth - 80, 120);
                cs.stroke();

                cs.beginText();
                cs.setFont(boldFont, 11);
                cs.setNonStrokingColor(30 / 255f, 41 / 255f, 59 / 255f);
                String signatory = appProperties.getCertificate().getSignatoryName() != null ?
                        appProperties.getCertificate().getSignatoryName() : "Academic Advisory Board";
                cs.newLineAtOffset(pageWidth - 280, 105);
                cs.showText(signatory);
                cs.endText();

                cs.beginText();
                cs.setFont(subFont, 10);
                cs.setNonStrokingColor(100 / 255f, 116 / 255f, 139 / 255f);
                cs.newLineAtOffset(pageWidth - 280, 90);
                cs.showText(appProperties.getCertificate().getSignatoryTitle());
                cs.endText();

                // Verification link at bottom center
                String verifyUrl = appProperties.getBaseUrl() + "/verify-certificate/" + cert.getCertificateId();
                cs.beginText();
                cs.setFont(subFont, 8);
                cs.setNonStrokingColor(148 / 255f, 163 / 255f, 184 / 255f);
                float vWidth = subFont.getStringWidth("Verify authenticity at: " + verifyUrl) / 1000 * 8;
                cs.newLineAtOffset((pageWidth - vWidth) / 2, 50);
                cs.showText("Verify authenticity at: " + verifyUrl);
                cs.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            log.error("Failed to generate certificate PDF: {}", e.getMessage(), e);
            throw new RuntimeException("PDF generation failed", e);
        }
    }
}
