package com.skillforge.lms.dto.certificate;

import com.skillforge.lms.entity.Certificate;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@Builder
public class CertificateDto {
    private Long id;
    private String certificateId;
    private Long courseId;
    private String studentName;
    private String courseTitle;
    private LocalDate issueDate;
    private String fileUrl;

    public CertificateDto() {
    }

    public CertificateDto(Long id, String certificateId, Long courseId, String studentName, String courseTitle, LocalDate issueDate, String fileUrl) {
        this.id = id;
        this.certificateId = certificateId;
        this.courseId = courseId;
        this.studentName = studentName;
        this.courseTitle = courseTitle;
        this.issueDate = issueDate;
        this.fileUrl = fileUrl;
    }

    public static CertificateDto fromEntity(Certificate cert) {
        return CertificateDto.builder()
                .id(cert.getId())
                .certificateId(cert.getCertificateId())
                .courseId(cert.getCourse() != null ? cert.getCourse().getId() : null)
                .studentName(cert.getStudentName())
                .courseTitle(cert.getCourseTitle())
                .issueDate(cert.getIssueDate())
                .fileUrl(cert.getFileUrl())
                .build();
    }
}
