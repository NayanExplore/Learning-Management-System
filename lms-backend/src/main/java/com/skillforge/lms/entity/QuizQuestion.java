package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_questions")
@Getter @Setter
@Builder
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false, length = 20)
    private QuestionType questionType = QuestionType.SINGLE_CHOICE;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    private int points = 1;

    @Column(name = "sort_order")
    private int sortOrder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<AnswerOption> options = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public QuizQuestion() {
    }

    public QuizQuestion(Long id, Quiz quiz, String questionText, QuestionType questionType, String explanation, int points, int sortOrder, LocalDateTime createdAt, List<AnswerOption> options) {
        this.id = id;
        this.quiz = quiz;
        this.questionText = questionText;
        this.questionType = questionType;
        this.explanation = explanation;
        this.points = points;
        this.sortOrder = sortOrder;
        this.createdAt = createdAt;
        this.options = options;
    }

    public enum QuestionType {
        SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE
    }
}
