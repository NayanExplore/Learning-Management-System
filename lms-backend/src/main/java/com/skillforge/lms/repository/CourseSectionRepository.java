package com.skillforge.lms.repository;

import com.skillforge.lms.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
    List<CourseSection> findByCourseIdOrderBySortOrderAsc(Long courseId);
    int countByCourseId(Long courseId);
}
