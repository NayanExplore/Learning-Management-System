package com.skillforge.lms.controller;

import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.quiz.QuizDto;
import com.skillforge.lms.dto.quiz.QuizResultDto;
import com.skillforge.lms.dto.quiz.QuizSubmitRequest;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
@Tag(name = "Quizzes", description = "Taking quizzes and server-side evaluation")
public class QuizController {

    private final QuizService quizService;
    private final AuthService authService;

    public QuizController(QuizService quizService, AuthService authService) {
        this.quizService = quizService;
        this.authService = authService;
    }

    @GetMapping("/quizzes/{id}")
    @Operation(summary = "Get quiz questions for a student (without correct answers)")
    public ResponseEntity<ApiResponse<QuizDto>> getQuiz(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        QuizDto quiz = quizService.getQuizForStudent(id, user);
        return ResponseEntity.ok(ApiResponse.success(quiz));
    }

    @PostMapping("/quizzes/{id}/submit")
    @Operation(summary = "Submit quiz answers, receive grade and auto-issue certificate if course completed")
    public ResponseEntity<ApiResponse<QuizResultDto>> submitQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizSubmitRequest request) {
        User user = authService.getCurrentUser();
        QuizResultDto result = quizService.submitQuiz(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Quiz submitted successfully", result));
    }

    @GetMapping("/courses/{courseId}/quizzes")
    @Operation(summary = "Get all quizzes for an enrolled course")
    public ResponseEntity<ApiResponse<List<QuizDto>>> getCourseQuizzes(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        List<QuizDto> quizzes = quizService.getQuizzesForCourse(courseId, user);
        return ResponseEntity.ok(ApiResponse.success(quizzes));
    }
}
