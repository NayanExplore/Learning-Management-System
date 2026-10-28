package com.skillforge.lms.service.impl;

import com.skillforge.lms.dto.progress.ProgressUpdateDto;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.Enrollment;
import com.skillforge.lms.entity.Lesson;
import com.skillforge.lms.entity.LessonProgress;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.ForbiddenException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.EnrollmentRepository;
import com.skillforge.lms.repository.LessonProgressRepository;
import com.skillforge.lms.repository.LessonRepository;
import com.skillforge.lms.service.CertificateService;
import com.skillforge.lms.service.ProgressService;
import com.skillforge.lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProgressServiceImpl implements ProgressService {

    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateService certificateService;
    private final QuizService quizService;

    public ProgressServiceImpl(LessonProgressRepository progressRepository,
                               LessonRepository lessonRepository,
                               EnrollmentRepository enrollmentRepository,
                               CertificateService certificateService,
                               @Lazy QuizService quizService) {
        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateService = certificateService;
        this.quizService = quizService;
    }

    @Override
    @Transactional
    public LessonProgress updateProgress(Long lessonId, ProgressUpdateDto request, User user) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        Course course = lesson.getCourse();
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId())
                .orElseThrow(() -> new ForbiddenException("You must be enrolled in this course to track progress."));

        LessonProgress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .orElseGet(() -> LessonProgress.builder()
                        .user(user)
                        .lesson(lesson)
                        .course(course)
                        .build());

        if (request.isCompleted() && !progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progress.setProgressPct(new BigDecimal(100));
        } else if (request.getProgressPct() != null) {
            progress.setProgressPct(request.getProgressPct());
        }

        if (request.getLastPosition() != null) {
            progress.setLastPosition(request.getLastPosition());
        }

        progress = progressRepository.save(progress);

        // Recalculate enrollment overall progress percentage
        long totalMandatory = lessonRepository.countByCourseIdAndMandatoryTrue(course.getId());
        long completedMandatory = progressRepository.countByUserIdAndCourseIdAndCompletedTrue(user.getId(), course.getId());

        if (totalMandatory > 0) {
            BigDecimal pct = BigDecimal.valueOf(completedMandatory)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalMandatory), 2, RoundingMode.HALF_UP);
            enrollment.setProgressPct(pct.min(BigDecimal.valueOf(100)));
            enrollmentRepository.save(enrollment);
        }

        // Check course completion rules
        checkAndCompleteCourse(user, course.getId());

        return progress;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getCourseProgress(Long courseId, User user) {
        List<LessonProgress> list = progressRepository.findByUserIdAndCourseId(user.getId(), courseId);
        List<Long> completedLessonIds = list.stream()
                .filter(LessonProgress::isCompleted)
                .map(p -> p.getLesson().getId())
                .collect(Collectors.toList());

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId).orElse(null);

        Map<String, Object> res = new HashMap<>();
        res.put("courseId", courseId);
        res.put("completedLessonIds", completedLessonIds);
        res.put("overallProgressPct", enrollment != null ? enrollment.getProgressPct() : BigDecimal.ZERO);
        res.put("status", enrollment != null ? enrollment.getStatus().name() : "NOT_ENROLLED");
        return res;
    }

    @Override
    @Transactional
    public boolean checkAndCompleteCourse(User user, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId).orElse(null);
        if (enrollment == null) return false;

        // If already completed, return true
        if (enrollment.getStatus() == Enrollment.EnrollmentStatus.COMPLETED) {
            return true;
        }

        // Rule 1: All mandatory lessons completed
        long totalMandatory = lessonRepository.countByCourseIdAndMandatoryTrue(courseId);
        long completedMandatory = progressRepository.countByUserIdAndCourseIdAndCompletedTrue(user.getId(), courseId);

        if (completedMandatory < totalMandatory) {
            return false;
        }

        // Rule 2: All required quizzes passed
        boolean quizzesPassed = quizService.areAllRequiredQuizzesPassed(courseId, user.getId());
        if (!quizzesPassed) {
            return false;
        }

        // Both rules satisfied -> mark COMPLETED and issue certificate!
        enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
        enrollment.setCompletedAt(LocalDateTime.now());
        enrollment.setProgressPct(BigDecimal.valueOf(100));
        enrollmentRepository.save(enrollment);

        log.info("Student {} completed course {}. Generating certificate...", user.getEmail(), courseId);
        certificateService.issueCertificate(user, enrollment.getCourse());

        return true;
    }
}
