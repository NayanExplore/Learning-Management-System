package com.skillforge.lms.service;

import com.skillforge.lms.dto.course.*;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseService {
    Page<CourseSummaryDto> getPublishedCourses(String query, String level, Pageable pageable);
    List<CourseSummaryDto> getFeaturedCourses();
    CourseDetailDto getCourseBySlug(String slug, User currentUser);
    CourseDetailDto getCourseById(Long id, User currentUser);
    Course getCourseEntity(Long id);

    // Admin operations
    CourseDetailDto createCourse(CourseCreateRequest request, User admin);
    CourseDetailDto updateCourse(Long id, CourseCreateRequest request);
    void setCourseStatus(Long id, Course.CourseStatus status);
    CourseSectionDto addSection(Long courseId, SectionCreateRequest request);
    CourseSectionDto updateSection(Long sectionId, SectionCreateRequest request);
    void deleteSection(Long sectionId);
    void reorderSections(Long courseId, List<Long> sectionIds);
    LessonDto addLesson(Long sectionId, LessonCreateRequest request);
    LessonDto updateLesson(Long lessonId, LessonCreateRequest request);
    void deleteLesson(Long lessonId);
    void reorderLessons(Long sectionId, List<Long> lessonIds);
    boolean hasEnrollmentAccess(Long userId, Long courseId);
}
