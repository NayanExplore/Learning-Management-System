package com.skillforge.lms.dto.quiz;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@Builder
public class QuizResultDto {
    private Long attemptId;
    private Long quizId;
    private BigDecimal score;
    private int totalPoints;
    private int earnedPoints;
    private int passingScore;
    private boolean passed;
    private boolean courseCompleted;
    private String certificateId; // Non-null if this completion triggered certificate issuance!
    private List<QuestionFeedback> feedback;

    public QuizResultDto() {
    }

    public QuizResultDto(Long attemptId, Long quizId, BigDecimal score, int totalPoints, int earnedPoints, int passingScore, boolean passed, boolean courseCompleted, String certificateId, List<QuestionFeedback> feedback) {
        this.attemptId = attemptId;
        this.quizId = quizId;
        this.score = score;
        this.totalPoints = totalPoints;
        this.earnedPoints = earnedPoints;
        this.passingScore = passingScore;
        this.passed = passed;
        this.courseCompleted = courseCompleted;
        this.certificateId = certificateId;
        this.feedback = feedback;
    }

    @Getter @Setter
    @Builder
    public static class QuestionFeedback {
        private Long questionId;
        private boolean correct;
        private int pointsEarned;
        private String explanation;
        private List<Long> correctOptionIds;

        public QuestionFeedback() {
        }

        public QuestionFeedback(Long questionId, boolean correct, int pointsEarned, String explanation, List<Long> correctOptionIds) {
            this.questionId = questionId;
            this.correct = correct;
            this.pointsEarned = pointsEarned;
            this.explanation = explanation;
            this.correctOptionIds = correctOptionIds;
        }
    }
}
