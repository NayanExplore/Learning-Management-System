package com.skillforge.lms.repository;

import com.skillforge.lms.entity.QuizResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizResponseRepository extends JpaRepository<QuizResponse, Long> {
    List<QuizResponse> findByAttemptId(Long attemptId);
}
