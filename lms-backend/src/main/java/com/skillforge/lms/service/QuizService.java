package com.skillforge.lms.service;

import com.skillforge.lms.dto.quiz.QuizDto;
import com.skillforge.lms.dto.quiz.QuizResultDto;
import com.skillforge.lms.dto.quiz.QuizSubmitRequest;
import com.skillforge.lms.entity.User;

import java.util.List;

public interface QuizService {
    QuizDto getQuizForStudent(Long quizId, User user);
    QuizResultDto submitQuiz(Long quizId, QuizSubmitRequest request, User user);
    boolean areAllRequiredQuizzesPassed(Long courseId, Long userId);
    List<QuizDto> getQuizzesForCourse(Long courseId, User user);
}
