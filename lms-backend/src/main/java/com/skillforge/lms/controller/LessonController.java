package com.skillforge.lms.controller;

import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.course.LessonDto;
import com.skillforge.lms.dto.progress.ProgressUpdateDto;
import com.skillforge.lms.entity.Lesson;
import com.skillforge.lms.entity.LessonProgress;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.ForbiddenException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.LessonRepository;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.CourseService;
import com.skillforge.lms.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/lessons")
@Tag(name = "Lessons", description = "Lesson content access and progress tracking")
public class LessonController {

    private final LessonRepository lessonRepository;
    private final CourseService courseService;
    private final ProgressService progressService;
    private final AuthService authService;

    public LessonController(LessonRepository lessonRepository, CourseService courseService, ProgressService progressService, AuthService authService) {
        this.lessonRepository = lessonRepository;
        this.courseService = courseService;
        this.progressService = progressService;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lesson details and content (protected by enrollment unless preview)")
    public ResponseEntity<ApiResponse<LessonDto>> getLesson(@PathVariable Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", id));

        User currentUser = null;
        try {
            currentUser = authService.getCurrentUser();
        } catch (Exception ignored) {}

        boolean hasAccess = lesson.isPreview();
        if (currentUser != null) {
            if (currentUser.getRole() == User.Role.ADMIN ||
                    courseService.hasEnrollmentAccess(currentUser.getId(), lesson.getCourse().getId())) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            throw new ForbiddenException("You must be enrolled in this course to access this lesson.");
        }

        return ResponseEntity.ok(ApiResponse.success(LessonDto.fromEntity(lesson, true)));
    }

    @PostMapping("/{id}/progress")
    @Operation(summary = "Update lesson completion and watch progress")
    public ResponseEntity<ApiResponse<Void>> updateProgress(
            @PathVariable Long id,
            @Valid @RequestBody ProgressUpdateDto request) {
        User user = authService.getCurrentUser();
        progressService.updateProgress(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Progress updated", null));
    }
}
