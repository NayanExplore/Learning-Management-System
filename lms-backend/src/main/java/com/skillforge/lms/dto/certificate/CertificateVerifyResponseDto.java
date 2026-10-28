package com.skillforge.lms.dto.certificate;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@Builder
public class CertificateVerifyResponseDto {
    private boolean valid;
    private String certificateId;
    private String studentName;
    private String courseTitle;
    private LocalDate issueDate;
    private String issuer;

    public CertificateVerifyResponseDto() {
    }

    public CertificateVerifyResponseDto(boolean valid, String certificateId, String studentName, String courseTitle, LocalDate issueDate, String issuer) {
        this.valid = valid;
        this.certificateId = certificateId;
        this.studentName = studentName;
        this.courseTitle = courseTitle;
        this.issueDate = issueDate;
        this.issuer = issuer;
    }
}
