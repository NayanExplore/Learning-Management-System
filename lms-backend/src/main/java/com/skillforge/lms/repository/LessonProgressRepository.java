package com.skillforge.lms.repository;

import com.skillforge.lms.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<LessonProgress> findByUserIdAndCourseId(Long userId, Long courseId);
    long countByUserIdAndCourseIdAndCompletedTrue(Long userId, Long courseId);
}
