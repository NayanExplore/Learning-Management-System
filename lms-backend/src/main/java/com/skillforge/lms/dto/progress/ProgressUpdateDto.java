package com.skillforge.lms.dto.progress;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter @Setter
public class ProgressUpdateDto {
    private boolean completed;

    @Min(0) @Max(100)
    private BigDecimal progressPct;

    private Integer lastPosition; // seconds in video
}
