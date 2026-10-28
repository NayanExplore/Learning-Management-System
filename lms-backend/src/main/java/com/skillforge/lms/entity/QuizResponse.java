package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_responses")
@Getter @Setter
@Builder
public class QuizResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;

    @Column(name = "selected_option_ids", columnDefinition = "json")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private Long[] selectedOptionIds;

    @Column(name = "is_correct")
    private Boolean correct;

    @Column(name = "points_earned")
    private int pointsEarned;

    public QuizResponse() {
    }

    public QuizResponse(Long id, QuizAttempt attempt, QuizQuestion question, Long[] selectedOptionIds, Boolean correct, int pointsEarned) {
        this.id = id;
        this.attempt = attempt;
        this.question = question;
        this.selectedOptionIds = selectedOptionIds;
        this.correct = correct;
        this.pointsEarned = pointsEarned;
    }
}
