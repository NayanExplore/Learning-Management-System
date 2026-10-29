package com.skillforge.lms.repository;

import com.skillforge.lms.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<LessonProgress> findByUserIdAndCourseId(Long userId, Long courseId);
    long countByUserIdAndCourseIdAndCompletedTrue(Long userId, Long courseId);

    @Modifying
    @Query("DELETE FROM LessonProgress lp WHERE lp.lesson.id = :lessonId")
    void deleteByLessonId(@Param("lessonId") Long lessonId);

    @Modifying
    @Query("DELETE FROM LessonProgress lp WHERE lp.lesson.id IN :lessonIds")
    void deleteByLessonIdIn(@Param("lessonIds") List<Long> lessonIds);
}
