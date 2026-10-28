package com.skillforge.lms.repository;

import com.skillforge.lms.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySectionIdOrderBySortOrderAsc(Long sectionId);
    List<Lesson> findByCourseIdOrderBySortOrderAsc(Long courseId);
    List<Lesson> findByCourseIdAndPreviewTrue(Long courseId);
    long countByCourseId(Long courseId);
    long countByCourseIdAndMandatoryTrue(Long courseId);
}
