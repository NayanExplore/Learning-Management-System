package com.skillforge.lms.repository;

import com.skillforge.lms.entity.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    List<Enrollment> findByUserId(Long userId);
    Page<Enrollment> findByUserId(Long userId, Pageable pageable);
    Page<Enrollment> findByCourseId(Long courseId, Pageable pageable);
    long countByCourseId(Long courseId);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course WHERE e.user.id = :userId")
    List<Enrollment> findByUserIdWithCourse(@Param("userId") Long userId);

    @Query(value = "SELECT e FROM Enrollment e JOIN FETCH e.user u JOIN FETCH e.course c " +
           "WHERE (:courseId IS NULL OR c.id = :courseId) " +
           "AND (:status IS NULL OR e.status = :status) " +
           "AND (:q IS NULL OR :q = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(c.title) LIKE LOWER(CONCAT('%', :q, '%')))",
           countQuery = "SELECT COUNT(e) FROM Enrollment e " +
           "WHERE (:courseId IS NULL OR e.course.id = :courseId) " +
           "AND (:status IS NULL OR e.status = :status) " +
           "AND (:q IS NULL OR :q = '' OR LOWER(e.user.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(e.user.email) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(e.course.title) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Enrollment> findFilteredEnrollments(@Param("courseId") Long courseId,
                                            @Param("status") Enrollment.EnrollmentStatus status,
                                            @Param("q") String q,
                                            Pageable pageable);

    long countByStatus(Enrollment.EnrollmentStatus status);
}
