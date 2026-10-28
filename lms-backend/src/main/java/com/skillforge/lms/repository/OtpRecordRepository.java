package com.skillforge.lms.repository;

import com.skillforge.lms.entity.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRecordRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findTopByPhoneAndPurposeAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String phone, OtpRecord.OtpPurpose purpose, LocalDateTime now);
    Optional<OtpRecord> findTopByEmailAndPurposeAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String email, OtpRecord.OtpPurpose purpose, LocalDateTime now);
    Optional<OtpRecord> findTopByEmailAndPurposeAndExpiresAtAfterOrderByCreatedAtDesc(
            String email, OtpRecord.OtpPurpose purpose, LocalDateTime now);
    List<OtpRecord> findAllByEmailAndPurpose(String email, OtpRecord.OtpPurpose purpose);
    long countByPhoneAndPurposeAndCreatedAtAfter(String phone, OtpRecord.OtpPurpose purpose, LocalDateTime since);
    long countByEmailAndPurposeAndCreatedAtAfter(String email, OtpRecord.OtpPurpose purpose, LocalDateTime since);
}
