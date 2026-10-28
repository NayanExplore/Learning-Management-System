package com.skillforge.lms.repository;

import com.skillforge.lms.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findBySlug(String slug);
    boolean existsBySlug(String slug);
    Page<Course> findByStatus(Course.CourseStatus status, Pageable pageable);
    List<Course> findByStatusAndFeaturedTrue(Course.CourseStatus status);

    @Query("SELECT c FROM Course c WHERE c.status = :status AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.shortDescription) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Course> searchPublished(@Param("status") Course.CourseStatus status, @Param("q") String query, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = :status AND c.level = :level")
    Page<Course> findByStatusAndLevel(@Param("status") Course.CourseStatus status, @Param("level") Course.CourseLevel level, Pageable pageable);

    long countByStatus(Course.CourseStatus status);

    @Query("SELECT c FROM Course c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:level IS NULL OR c.level = :level) AND " +
           "(:q IS NULL OR :q = '' OR LOWER(c.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(c.shortDescription) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Course> searchAdminCourses(@Param("status") Course.CourseStatus status,
                                    @Param("level") Course.CourseLevel level,
                                    @Param("q") String query,
                                    Pageable pageable);
}
