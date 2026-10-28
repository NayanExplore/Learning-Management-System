package com.skillforge.lms.service;

import com.skillforge.lms.dto.progress.ProgressUpdateDto;
import com.skillforge.lms.entity.LessonProgress;
import com.skillforge.lms.entity.User;

import java.math.BigDecimal;
import java.util.Map;

public interface ProgressService {
    LessonProgress updateProgress(Long lessonId, ProgressUpdateDto request, User user);
    Map<String, Object> getCourseProgress(Long courseId, User user);
    boolean checkAndCompleteCourse(User user, Long courseId);
}
