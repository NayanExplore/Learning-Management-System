package com.skillforge.lms.dto.quiz;

import com.skillforge.lms.entity.Quiz;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Builder
public class QuizDto {
    private Long id;
    private Long courseId;
    private Long lessonId;
    private String title;
    private String description;
    private int passingScore;
    private Integer timeLimitMinutes;
    private boolean required;
    @Builder.Default
    private List<QuestionDto> questions = new ArrayList<>();

    public QuizDto() {
    }

    public QuizDto(Long id, Long courseId, Long lessonId, String title, String description, int passingScore, Integer timeLimitMinutes, boolean required, List<QuestionDto> questions) {
        this.id = id;
        this.courseId = courseId;
        this.lessonId = lessonId;
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
        this.required = required;
        this.questions = questions;
    }

    @Getter @Setter
    @Builder
    public static class QuestionDto {
        private Long id;
        private String questionText;
        private String questionType;
        private int points;
        private List<OptionDto> options;

        public QuestionDto() {
        }

        public QuestionDto(Long id, String questionText, String questionType, int points, List<OptionDto> options) {
            this.id = id;
            this.questionText = questionText;
            this.questionType = questionType;
            this.points = points;
            this.options = options;
        }
    }

    @Getter @Setter
    @Builder
    public static class OptionDto {
        private Long id;
        private String optionText;

        public OptionDto() {
        }

        public OptionDto(Long id, String optionText) {
            this.id = id;
            this.optionText = optionText;
        }
    }

    public static QuizDto fromEntity(Quiz quiz) {
        List<QuestionDto> questionDtos = new ArrayList<>();
        if (quiz.getQuestions() != null) {
            for (var q : quiz.getQuestions()) {
                List<OptionDto> optionDtos = new ArrayList<>();
                if (q.getOptions() != null) {
                    for (var opt : q.getOptions()) {
                        optionDtos.add(new OptionDto(opt.getId(), opt.getOptionText()));
                    }
                }
                questionDtos.add(QuestionDto.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .questionType(q.getQuestionType().name())
                        .points(q.getPoints())
                        .options(optionDtos)
                        .build());
            }
        }

        return QuizDto.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse() != null ? quiz.getCourse().getId() : null)
                .lessonId(quiz.getLesson() != null ? quiz.getLesson().getId() : null)
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .passingScore(quiz.getPassingScore())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .required(quiz.isRequired())
                .questions(questionDtos)
                .build();
    }
}
