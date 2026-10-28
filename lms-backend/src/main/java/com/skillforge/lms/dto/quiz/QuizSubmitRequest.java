package com.skillforge.lms.dto.quiz;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class QuizSubmitRequest {

    @NotEmpty(message = "Answers are required")
    private List<QuestionAnswer> answers;

    @Getter @Setter
    public static class QuestionAnswer {
        private Long questionId;
        private List<Long> selectedOptionIds;
    }
}
