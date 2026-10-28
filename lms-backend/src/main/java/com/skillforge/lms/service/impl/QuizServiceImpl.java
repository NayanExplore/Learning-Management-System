package com.skillforge.lms.service.impl;

import com.skillforge.lms.dto.quiz.QuizDto;
import com.skillforge.lms.dto.quiz.QuizResultDto;
import com.skillforge.lms.dto.quiz.QuizSubmitRequest;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.ForbiddenException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.*;
import com.skillforge.lms.service.CertificateService;
import com.skillforge.lms.service.EnrollmentService;
import com.skillforge.lms.service.ProgressService;
import com.skillforge.lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final QuizResponseRepository responseRepository;
    private final EnrollmentService enrollmentService;
    private final ProgressService progressService;
    private final CertificateService certificateService;

    public QuizServiceImpl(QuizRepository quizRepository, QuizQuestionRepository questionRepository, AnswerOptionRepository answerOptionRepository, QuizAttemptRepository attemptRepository, QuizResponseRepository responseRepository, EnrollmentService enrollmentService, ProgressService progressService, CertificateService certificateService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.attemptRepository = attemptRepository;
        this.responseRepository = responseRepository;
        this.enrollmentService = enrollmentService;
        this.progressService = progressService;
        this.certificateService = certificateService;
    }

    @Override
    @Transactional(readOnly = true)
    public QuizDto getQuizForStudent(Long quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        if (user.getRole() != User.Role.ADMIN && !enrollmentService.isEnrolled(user.getId(), quiz.getCourse().getId())) {
            throw new ForbiddenException("You must be enrolled in the course to access this quiz.");
        }

        return QuizDto.fromEntity(quiz);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizDto> getQuizzesForCourse(Long courseId, User user) {
        if (user.getRole() != User.Role.ADMIN && !enrollmentService.isEnrolled(user.getId(), courseId)) {
            throw new ForbiddenException("You must be enrolled in the course to view quizzes.");
        }
        return quizRepository.findByCourseIdOrderBySortOrderAsc(courseId)
                .stream()
                .map(QuizDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuizResultDto submitQuiz(Long quizId, QuizSubmitRequest request, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        if (!enrollmentService.isEnrolled(user.getId(), quiz.getCourse().getId())) {
            throw new ForbiddenException("You must be enrolled in the course to take this quiz.");
        }

        List<QuizQuestion> questions = questionRepository.findByQuizIdOrderBySortOrderAsc(quizId);
        if (questions.isEmpty()) {
            throw new BadRequestException("This quiz does not have any questions configured.");
        }

        Map<Long, QuizSubmitRequest.QuestionAnswer> answerMap = new HashMap<>();
        for (var ans : request.getAnswers()) {
            answerMap.put(ans.getQuestionId(), ans);
        }

        int totalPoints = 0;
        int earnedPoints = 0;
        List<QuizResultDto.QuestionFeedback> feedbackList = new ArrayList<>();
        List<QuizResponse> responsesToSave = new ArrayList<>();

        for (QuizQuestion q : questions) {
            totalPoints += q.getPoints();

            List<AnswerOption> correctOptions = answerOptionRepository.findByQuestionIdAndCorrectTrue(q.getId());
            Set<Long> correctOptionIds = correctOptions.stream().map(AnswerOption::getId).collect(Collectors.toSet());

            QuizSubmitRequest.QuestionAnswer submitted = answerMap.get(q.getId());
            Set<Long> selectedIds = (submitted != null && submitted.getSelectedOptionIds() != null)
                    ? new HashSet<>(submitted.getSelectedOptionIds())
                    : Collections.emptySet();

            boolean isCorrect = selectedIds.equals(correctOptionIds);
            int pointsEarned = isCorrect ? q.getPoints() : 0;
            earnedPoints += pointsEarned;

            feedbackList.add(QuizResultDto.QuestionFeedback.builder()
                    .questionId(q.getId())
                    .correct(isCorrect)
                    .pointsEarned(pointsEarned)
                    .explanation(q.getExplanation())
                    .correctOptionIds(new ArrayList<>(correctOptionIds))
                    .build());

            Long[] selectedArray = selectedIds.toArray(new Long[0]);
            QuizResponse qr = QuizResponse.builder()
                    .question(q)
                    .selectedOptionIds(selectedArray)
                    .correct(isCorrect)
                    .pointsEarned(pointsEarned)
                    .build();
            responsesToSave.add(qr);
        }

        BigDecimal scorePct = totalPoints > 0
                ? BigDecimal.valueOf(earnedPoints)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalPoints), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        boolean passed = scorePct.compareTo(BigDecimal.valueOf(quiz.getPassingScore())) >= 0;

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .user(user)
                .score(scorePct)
                .totalPoints(totalPoints)
                .earnedPoints(earnedPoints)
                .passed(passed)
                .submittedAt(LocalDateTime.now())
                .status(QuizAttempt.AttemptStatus.GRADED)
                .build();

        attempt = attemptRepository.save(attempt);

        for (QuizResponse qr : responsesToSave) {
            qr.setAttempt(attempt);
            responseRepository.save(qr);
        }

        log.info("Student {} submitted quiz {}. Score: {}%, Passed: {}", user.getEmail(), quiz.getTitle(), scorePct, passed);

        boolean courseCompleted = false;
        String certificateId = null;

        if (passed) {
            // Check if this pass completes the course!
            courseCompleted = progressService.checkAndCompleteCourse(user, quiz.getCourse().getId());
            if (courseCompleted) {
                Certificate cert = certificateService.getCertificateByCourseAndUser(quiz.getCourse().getId(), user.getId());
                if (cert != null) {
                    certificateId = cert.getCertificateId();
                }
            }
        }

        return QuizResultDto.builder()
                .attemptId(attempt.getId())
                .quizId(quiz.getId())
                .score(scorePct)
                .totalPoints(totalPoints)
                .earnedPoints(earnedPoints)
                .passingScore(quiz.getPassingScore())
                .passed(passed)
                .courseCompleted(courseCompleted)
                .certificateId(certificateId)
                .feedback(feedbackList)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean areAllRequiredQuizzesPassed(Long courseId, Long userId) {
        List<Quiz> requiredQuizzes = quizRepository.findByCourseIdAndRequiredTrue(courseId);
        if (requiredQuizzes.isEmpty()) {
            return true;
        }

        for (Quiz q : requiredQuizzes) {
            boolean hasPassed = attemptRepository.existsByQuizIdAndUserIdAndPassedTrue(q.getId(), userId);
            if (!hasPassed) {
                return false;
            }
        }
        return true;
    }
}
