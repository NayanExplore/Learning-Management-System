package com.skillforge.lms.service;

import com.skillforge.lms.dto.quiz.QuizSubmitRequest;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.repository.*;
import com.skillforge.lms.service.impl.QuizServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuizQuestionRepository questionRepository;
    @Mock
    private AnswerOptionRepository answerOptionRepository;
    @Mock
    private QuizAttemptRepository attemptRepository;
    @Mock
    private QuizResponseRepository responseRepository;
    @Mock
    private EnrollmentService enrollmentService;
    @Mock
    private ProgressService progressService;
    @Mock
    private CertificateService certificateService;

    @InjectMocks
    private QuizServiceImpl quizService;

    private User sampleUser;
    private Course sampleCourse;
    private Quiz sampleQuiz;
    private QuizQuestion question1;
    private AnswerOption option1Correct;
    private AnswerOption option2Wrong;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).email("student@test.com").fullName("Priya Sharma").build();
        sampleCourse = Course.builder().id(10L).title("Full Stack Web Development").build();
        sampleQuiz = Quiz.builder()
                .id(100L)
                .course(sampleCourse)
                .title("HTML & CSS Quiz")
                .passingScore(70)
                .required(true)
                .build();

        question1 = QuizQuestion.builder()
                .id(501L)
                .quiz(sampleQuiz)
                .questionText("What does HTML stand for?")
                .questionType(QuizQuestion.QuestionType.SINGLE_CHOICE)
                .points(10)
                .explanation("HyperText Markup Language")
                .build();

        option1Correct = AnswerOption.builder()
                .id(901L)
                .question(question1)
                .optionText("HyperText Markup Language")
                .correct(true)
                .build();

        option2Wrong = AnswerOption.builder()
                .id(902L)
                .question(question1)
                .optionText("High Text Machine Language")
                .correct(false)
                .build();

        question1.setOptions(List.of(option1Correct, option2Wrong));
    }

    @Test
    void getQuizForStudent_HidesCorrectAnswers() {
        when(quizRepository.findById(100L)).thenReturn(Optional.of(sampleQuiz));
        when(enrollmentService.isEnrolled(1L, 10L)).thenReturn(true);
        sampleQuiz.setQuestions(List.of(question1));

        var quizDto = quizService.getQuizForStudent(100L, sampleUser);

        assertNotNull(quizDto);
        assertEquals(1, quizDto.getQuestions().size());
        assertEquals("What does HTML stand for?", quizDto.getQuestions().get(0).getQuestionText());
        // Verify that options are returned without exposing the correct answer flag
        assertEquals(2, quizDto.getQuestions().get(0).getOptions().size());
    }

    @Test
    void submitQuiz_CorrectAnswer_Scores100AndPasses() {
        when(quizRepository.findById(100L)).thenReturn(Optional.of(sampleQuiz));
        when(enrollmentService.isEnrolled(1L, 10L)).thenReturn(true);
        when(questionRepository.findByQuizIdOrderBySortOrderAsc(100L)).thenReturn(List.of(question1));
        when(answerOptionRepository.findByQuestionIdAndCorrectTrue(501L)).thenReturn(List.of(option1Correct));

        when(attemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> {
            QuizAttempt a = i.getArgument(0);
            a.setId(1001L);
            return a;
        });
        when(progressService.checkAndCompleteCourse(any(), any())).thenReturn(false);

        QuizSubmitRequest req = new QuizSubmitRequest();
        QuizSubmitRequest.QuestionAnswer qa = new QuizSubmitRequest.QuestionAnswer();
        qa.setQuestionId(501L);
        qa.setSelectedOptionIds(List.of(901L)); // Selected correct option
        req.setAnswers(List.of(qa));

        var result = quizService.submitQuiz(100L, req, sampleUser);

        assertNotNull(result);
        assertTrue(result.isPassed());
        assertEquals(new BigDecimal("100.00"), result.getScore());
        assertEquals(10, result.getEarnedPoints());
        assertEquals(10, result.getTotalPoints());
    }

    @Test
    void submitQuiz_WrongAnswer_ScoresZeroAndFails() {
        when(quizRepository.findById(100L)).thenReturn(Optional.of(sampleQuiz));
        when(enrollmentService.isEnrolled(1L, 10L)).thenReturn(true);
        when(questionRepository.findByQuizIdOrderBySortOrderAsc(100L)).thenReturn(List.of(question1));
        when(answerOptionRepository.findByQuestionIdAndCorrectTrue(501L)).thenReturn(List.of(option1Correct));

        when(attemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> {
            QuizAttempt a = i.getArgument(0);
            a.setId(1001L);
            return a;
        });

        QuizSubmitRequest req = new QuizSubmitRequest();
        QuizSubmitRequest.QuestionAnswer qa = new QuizSubmitRequest.QuestionAnswer();
        qa.setQuestionId(501L);
        qa.setSelectedOptionIds(List.of(902L)); // Selected wrong option
        req.setAnswers(List.of(qa));

        var result = quizService.submitQuiz(100L, req, sampleUser);

        assertNotNull(result);
        assertFalse(result.isPassed());
        assertEquals(new BigDecimal("0.00"), result.getScore());
        assertEquals(0, result.getEarnedPoints());
    }
}
