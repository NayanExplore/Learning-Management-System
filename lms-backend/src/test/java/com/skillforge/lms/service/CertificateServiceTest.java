package com.skillforge.lms.service;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.entity.Certificate;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.repository.CertificateRepository;
import com.skillforge.lms.repository.EnrollmentRepository;
import com.skillforge.lms.service.impl.CertificateServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;
    @Mock
    private EnrollmentRepository enrollmentRepository;
    @Mock
    private FileStorageService fileStorageService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AppProperties appProperties;

    @InjectMocks
    private CertificateServiceImpl certificateService;

    private User sampleUser;
    private Course sampleCourse;

    @BeforeEach
    void setUp() {
        var certProps = new AppProperties.CertificateProperties();
        certProps.setCompanyName("SkillForge Academy");
        certProps.setSignatoryName("Dr. Vikram Sen");
        certProps.setSignatoryTitle("Dean of Academics");

        lenient().when(appProperties.getCertificate()).thenReturn(certProps);
        lenient().when(appProperties.getBaseUrl()).thenReturn("http://localhost:5173");

        sampleUser = User.builder()
                .id(1L)
                .email("student@test.com")
                .fullName("Aman Kumar")
                .build();

        sampleCourse = Course.builder()
                .id(10L)
                .title("Full Stack Web Development")
                .build();
    }

    @Test
    void issueCertificate_Success() {
        when(certificateRepository.findByUserIdAndCourseId(1L, 10L)).thenReturn(Optional.empty());
        when(enrollmentRepository.findByUserIdAndCourseId(1L, 10L)).thenReturn(Optional.empty());
        when(fileStorageService.uploadFile(anyString(), any(InputStream.class), anyLong(), anyString())).thenReturn("key");
        when(fileStorageService.getPresignedUrl(anyString())).thenReturn("http://presigned.url");
        when(certificateRepository.save(any(Certificate.class))).thenAnswer(i -> i.getArgument(0));

        Certificate cert = certificateService.issueCertificate(sampleUser, sampleCourse);

        assertNotNull(cert);
        assertNotNull(cert.getCertificateId());
        assertTrue(cert.getCertificateId().startsWith("SF-"));
        assertEquals("Aman Kumar", cert.getStudentName());
        assertEquals("Full Stack Web Development", cert.getCourseTitle());
        verify(notificationService).sendCertificateIssuedNotification(any(), any(), any());
    }

    @Test
    void issueCertificate_Duplicate_ReturnsExistingWithoutReissuing() {
        Certificate existing = Certificate.builder()
                .certificateId("SF-20261012-EXIST1")
                .user(sampleUser)
                .course(sampleCourse)
                .studentName("Aman Kumar")
                .courseTitle("Full Stack Web Development")
                .build();

        when(certificateRepository.findByUserIdAndCourseId(1L, 10L)).thenReturn(Optional.of(existing));

        Certificate cert = certificateService.issueCertificate(sampleUser, sampleCourse);

        assertEquals("SF-20261012-EXIST1", cert.getCertificateId());
        verify(certificateRepository, never()).save(any(Certificate.class));
        verify(fileStorageService, never()).uploadFile(any(), any(), anyLong(), any());
    }

    @Test
    void verifyCertificate_Valid_ReturnsPublicDetailsWithoutPii() {
        Certificate cert = Certificate.builder()
                .certificateId("SF-20261012-ABC123")
                .user(sampleUser)
                .course(sampleCourse)
                .studentName("Aman Kumar")
                .courseTitle("Full Stack Web Development")
                .issueDate(LocalDate.now())
                .build();

        when(certificateRepository.findByCertificateId("SF-20261012-ABC123")).thenReturn(Optional.of(cert));

        var res = certificateService.verifyCertificate("SF-20261012-ABC123");

        assertTrue(res.isValid());
        assertEquals("Aman Kumar", res.getStudentName());
        assertEquals("Full Stack Web Development", res.getCourseTitle());
        assertEquals("SkillForge Academy", res.getIssuer());
    }

    @Test
    void verifyCertificate_NotFound_ReturnsInvalid() {
        when(certificateRepository.findByCertificateId("SF-UNKNOWN")).thenReturn(Optional.empty());

        var res = certificateService.verifyCertificate("SF-UNKNOWN");

        assertFalse(res.isValid());
        assertEquals("SF-UNKNOWN", res.getCertificateId());
    }
}
