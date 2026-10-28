package com.skillforge.lms.repository;

import com.skillforge.lms.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourseIdOrderBySortOrderAsc(Long courseId);
    List<Quiz> findByCourseIdAndRequiredTrue(Long courseId);
    List<Quiz> findByLessonId(Long lessonId);
}
