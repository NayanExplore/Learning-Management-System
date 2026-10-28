package com.skillforge.lms.service;

import com.skillforge.lms.dto.certificate.CertificateDto;
import com.skillforge.lms.dto.certificate.CertificateVerifyResponseDto;
import com.skillforge.lms.entity.Certificate;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CertificateService {
    Certificate issueCertificate(User user, Course course);
    CertificateVerifyResponseDto verifyCertificate(String certificateId);
    byte[] downloadCertificatePdf(String certificateId, User currentUser);
    List<CertificateDto> getUserCertificates(User user);
    Page<CertificateDto> getUserCertificatesPaged(User user, Pageable pageable);
    Certificate getCertificateByCourseAndUser(Long courseId, Long userId);
}
