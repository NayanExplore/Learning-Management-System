package com.skillforge.lms.repository;

import com.skillforge.lms.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizIdAndUserIdOrderByStartedAtDesc(Long quizId, Long userId);
    long countByQuizIdAndUserId(Long quizId, Long userId);
    boolean existsByQuizIdAndUserIdAndPassedTrue(Long quizId, Long userId);
}
