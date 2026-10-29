package com.skillforge.lms.service.impl;

import com.skillforge.lms.dto.course.*;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.CourseSection;
import com.skillforge.lms.entity.Lesson;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.CourseRepository;
import com.skillforge.lms.repository.CourseSectionRepository;
import com.skillforge.lms.repository.EnrollmentRepository;
import com.skillforge.lms.repository.LessonRepository;
import com.skillforge.lms.repository.LessonProgressRepository;
import com.skillforge.lms.service.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public CourseServiceImpl(
            CourseRepository courseRepository,
            CourseSectionRepository sectionRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            LessonProgressRepository lessonProgressRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Override
    @Transactional(readOnly = true)
    public Page<CourseSummaryDto> getPublishedCourses(String query, String level, Pageable pageable) {
        Page<Course> courses;
        if (StringUtils.hasText(query)) {
            courses = courseRepository.searchPublished(Course.CourseStatus.PUBLISHED, query.trim(), pageable);
        } else if (StringUtils.hasText(level)) {
            try {
                Course.CourseLevel lvl = Course.CourseLevel.valueOf(level.toUpperCase());
                courses = courseRepository.findByStatusAndLevel(Course.CourseStatus.PUBLISHED, lvl, pageable);
            } catch (IllegalArgumentException e) {
                courses = courseRepository.findByStatus(Course.CourseStatus.PUBLISHED, pageable);
            }
        } else {
            courses = courseRepository.findByStatus(Course.CourseStatus.PUBLISHED, pageable);
        }
        return courses.map(CourseSummaryDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseSummaryDto> getFeaturedCourses() {
        return courseRepository.findByStatusAndFeaturedTrue(Course.CourseStatus.PUBLISHED)
                .stream()
                .map(CourseSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDetailDto getCourseBySlug(String slug, User currentUser) {
        Course course = courseRepository.findBySlug(slug)
                .orElseGet(() -> {
                    try {
                        Long id = Long.parseLong(slug);
                        return courseRepository.findById(id).orElse(null);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                });

        if (course == null) {
            throw new ResourceNotFoundException("Course", "slug or id", slug);
        }

        boolean hasAccess = hasEnrollmentAccess(currentUser != null ? currentUser.getId() : null, course.getId());
        if (currentUser != null && currentUser.getRole() == User.Role.ADMIN) {
            hasAccess = true;
        }

        return CourseDetailDto.fromEntity(course, hasAccess);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDetailDto getCourseById(Long id, User currentUser) {
        Course course = getCourseEntity(id);
        boolean hasAccess = hasEnrollmentAccess(currentUser != null ? currentUser.getId() : null, course.getId());
        if (currentUser != null && currentUser.getRole() == User.Role.ADMIN) {
            hasAccess = true;
        }
        return CourseDetailDto.fromEntity(course, hasAccess);
    }

    @Override
    @Transactional(readOnly = true)
    public Course getCourseEntity(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    @Override
    @Transactional
    public CourseDetailDto createCourse(CourseCreateRequest request, User admin) {
        String slug = StringUtils.hasText(request.getSlug()) ? slugify(request.getSlug()) : slugify(request.getTitle());
        if (courseRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Course course = Course.builder()
                .title(request.getTitle().trim())
                .slug(slug)
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .instructorName(request.getInstructorName())
                .instructorBio(request.getInstructorBio())
                .durationHours(request.getDurationHours())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .status(Course.CourseStatus.valueOf(request.getStatus()))
                .featured(request.isFeatured())
                .learningOutcomes(request.getLearningOutcomes())
                .prerequisites(request.getPrerequisites())
                .language(request.getLanguage())
                .level(Course.CourseLevel.valueOf(request.getLevel()))
                .createdBy(admin != null ? admin.getId() : null)
                .build();

        if (course.getStatus() == Course.CourseStatus.PUBLISHED) {
            course.setPublishedAt(LocalDateTime.now());
        }

        course = courseRepository.save(course);
        return CourseDetailDto.fromEntity(course, true);
    }

    @Override
    @Transactional
    public CourseDetailDto updateCourse(Long id, CourseCreateRequest request) {
        Course course = getCourseEntity(id);

        course.setTitle(request.getTitle().trim());
        if (StringUtils.hasText(request.getSlug())) {
            String newSlug = slugify(request.getSlug());
            if (!newSlug.equals(course.getSlug()) && courseRepository.existsBySlug(newSlug)) {
                throw new BadRequestException("Slug already in use by another course");
            }
            course.setSlug(newSlug);
        }
        course.setShortDescription(request.getShortDescription());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setInstructorName(request.getInstructorName());
        course.setInstructorBio(request.getInstructorBio());
        course.setDurationHours(request.getDurationHours());
        course.setPrice(request.getPrice());
        course.setOriginalPrice(request.getOriginalPrice());
        course.setFeatured(request.isFeatured());
        course.setLearningOutcomes(request.getLearningOutcomes());
        course.setPrerequisites(request.getPrerequisites());
        course.setLanguage(request.getLanguage());
        course.setLevel(Course.CourseLevel.valueOf(request.getLevel()));

        Course.CourseStatus newStatus = Course.CourseStatus.valueOf(request.getStatus());
        if (course.getStatus() != Course.CourseStatus.PUBLISHED && newStatus == Course.CourseStatus.PUBLISHED) {
            course.setPublishedAt(LocalDateTime.now());
        }
        course.setStatus(newStatus);

        course = courseRepository.save(course);
        return CourseDetailDto.fromEntity(course, true);
    }

    @Override
    @Transactional
    public void setCourseStatus(Long id, Course.CourseStatus status) {
        Course course = getCourseEntity(id);
        course.setStatus(status);
        if (status == Course.CourseStatus.PUBLISHED && course.getPublishedAt() == null) {
            course.setPublishedAt(LocalDateTime.now());
        }
        courseRepository.save(course);
    }

    @Override
    @Transactional
    public CourseSectionDto addSection(Long courseId, SectionCreateRequest request) {
        Course course = getCourseEntity(courseId);
        int nextOrder = sectionRepository.countByCourseId(courseId) + 1;

        CourseSection section = CourseSection.builder()
                .course(course)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .sortOrder(request.getSortOrder() > 0 ? request.getSortOrder() : nextOrder)
                .build();

        section = sectionRepository.save(section);
        return CourseSectionDto.fromEntity(section, true);
    }

    @Override
    @Transactional
    public CourseSectionDto updateSection(Long sectionId, SectionCreateRequest request) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseSection", "id", sectionId));

        section.setTitle(request.getTitle().trim());
        section.setDescription(request.getDescription());
        if (request.getSortOrder() > 0) {
            section.setSortOrder(request.getSortOrder());
        }

        section = sectionRepository.save(section);
        return CourseSectionDto.fromEntity(section, true);
    }

    @Override
    @Transactional
    public void deleteSection(Long sectionId) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseSection", "id", sectionId));

        if (section.getLessons() != null && !section.getLessons().isEmpty()) {
            List<Long> lessonIds = section.getLessons().stream().map(Lesson::getId).toList();
            lessonProgressRepository.deleteByLessonIdIn(lessonIds);
        }

        sectionRepository.delete(section);
    }

    @Override
    @Transactional
    public void reorderSections(Long courseId, List<Long> sectionIds) {
        if (sectionIds == null || sectionIds.isEmpty()) return;
        List<CourseSection> sections = sectionRepository.findByCourseIdOrderBySortOrderAsc(courseId);
        Map<Long, CourseSection> map = sections.stream()
                .collect(Collectors.toMap(CourseSection::getId, s -> s));

        for (int i = 0; i < sectionIds.size(); i++) {
            CourseSection s = map.get(sectionIds.get(i));
            if (s != null) {
                s.setSortOrder(i + 1);
                sectionRepository.save(s);
            }
        }
    }

    @Override
    @Transactional
    public LessonDto addLesson(Long sectionId, LessonCreateRequest request) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("CourseSection", "id", sectionId));

        int nextOrder = (int) lessonRepository.countByCourseId(section.getCourse().getId()) + 1;

        Lesson lesson = Lesson.builder()
                .section(section)
                .course(section.getCourse())
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .contentType(Lesson.ContentType.valueOf(request.getContentType()))
                .videoUrl(request.getVideoUrl())
                .videoDurationSeconds(request.getVideoDurationSeconds())
                .contentText(request.getContentText())
                .sortOrder(request.getSortOrder() > 0 ? request.getSortOrder() : nextOrder)
                .preview(request.isPreview())
                .mandatory(request.isMandatory())
                .build();

        lesson = lessonRepository.save(lesson);
        return LessonDto.fromEntity(lesson, true);
    }

    @Override
    @Transactional
    public LessonDto updateLesson(Long lessonId, LessonCreateRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        if (request.getSectionId() != null && !request.getSectionId().equals(lesson.getSection().getId())) {
            CourseSection newSection = sectionRepository.findById(request.getSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("CourseSection", "id", request.getSectionId()));
            lesson.setSection(newSection);
        }

        lesson.setTitle(request.getTitle().trim());
        lesson.setDescription(request.getDescription());
        lesson.setContentType(Lesson.ContentType.valueOf(request.getContentType()));
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setVideoDurationSeconds(request.getVideoDurationSeconds());
        lesson.setContentText(request.getContentText());
        lesson.setSortOrder(request.getSortOrder());
        lesson.setPreview(request.isPreview());
        lesson.setMandatory(request.isMandatory());

        lesson = lessonRepository.save(lesson);
        return LessonDto.fromEntity(lesson, true);
    }

    @Override
    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));
        lessonProgressRepository.deleteByLessonId(lessonId);
        lessonRepository.delete(lesson);
    }

    @Override
    @Transactional
    public void reorderLessons(Long sectionId, List<Long> lessonIds) {
        if (lessonIds == null || lessonIds.isEmpty()) return;
        List<Lesson> lessons = lessonRepository.findBySectionIdOrderBySortOrderAsc(sectionId);
        Map<Long, Lesson> map = lessons.stream()
                .collect(Collectors.toMap(Lesson::getId, l -> l));

        for (int i = 0; i < lessonIds.size(); i++) {
            Lesson l = map.get(lessonIds.get(i));
            if (l != null) {
                l.setSortOrder(i + 1);
                lessonRepository.save(l);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasEnrollmentAccess(Long userId, Long courseId) {
        if (userId == null) return false;
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    private String slugify(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-+", "-");
    }
}
