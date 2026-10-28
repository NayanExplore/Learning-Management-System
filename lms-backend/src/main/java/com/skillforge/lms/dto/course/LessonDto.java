package com.skillforge.lms.dto.course;

import com.skillforge.lms.entity.Lesson;
import lombok.*;

@Getter @Setter
@Builder
public class LessonDto {
    private Long id;
    private Long sectionId;
    private Long courseId;
    private String title;
    private String description;
    private String contentType;
    private String videoUrl;
    private Integer videoDurationSeconds;
    private String contentText;
    private int sortOrder;
    private boolean preview;
    private boolean mandatory;
    private boolean completed; // student context

    public LessonDto() {
    }

    public LessonDto(Long id, Long sectionId, Long courseId, String title, String description, String contentType, String videoUrl, Integer videoDurationSeconds, String contentText, int sortOrder, boolean preview, boolean mandatory, boolean completed) {
        this.id = id;
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.contentType = contentType;
        this.videoUrl = videoUrl;
        this.videoDurationSeconds = videoDurationSeconds;
        this.contentText = contentText;
        this.sortOrder = sortOrder;
        this.preview = preview;
        this.mandatory = mandatory;
        this.completed = completed;
    }

    public static LessonDto fromEntity(Lesson lesson, boolean hasAccess) {
        LessonDto.LessonDtoBuilder builder = LessonDto.builder()
                .id(lesson.getId())
                .sectionId(lesson.getSection() != null ? lesson.getSection().getId() : null)
                .courseId(lesson.getCourse() != null ? lesson.getCourse().getId() : null)
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .contentType(lesson.getContentType().name())
                .videoDurationSeconds(lesson.getVideoDurationSeconds())
                .sortOrder(lesson.getSortOrder())
                .preview(lesson.isPreview())
                .mandatory(lesson.isMandatory());

        // Only include video URL and content text if preview is true OR user has enrolled access
        if (hasAccess || lesson.isPreview()) {
            builder.videoUrl(lesson.getVideoUrl())
                   .contentText(lesson.getContentText());
        }

        return builder.build();
    }
}
