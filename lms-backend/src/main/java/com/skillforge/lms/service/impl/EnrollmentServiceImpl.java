package com.skillforge.lms.service.impl;

import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.Enrollment;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.CourseRepository;
import com.skillforge.lms.repository.EnrollmentRepository;
import com.skillforge.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Slf4j
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public Enrollment enrollStudent(User user, Course course) {
        // Idempotency check: don't duplicate enrollment
        var existing = enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId());
        if (existing.isPresent()) {
            log.info("Student {} already enrolled in course {}, returning existing enrollment", user.getId(), course.getId());
            return existing.get();
        }

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .status(Enrollment.EnrollmentStatus.ACTIVE)
                .progressPct(BigDecimal.ZERO)
                .build();

        enrollment = enrollmentRepository.save(enrollment);

        // Increment course enrollment count
        course.setEnrollmentCount(course.getEnrollmentCount() + 1);
        courseRepository.save(course);

        log.info("Enrolled student {} in course {}", user.getEmail(), course.getTitle());
        return enrollment;
    }

    @Override
    @Transactional(readOnly = true)
    public Enrollment getEnrollment(Long userId, Long courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for student in course"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Enrollment> getStudentEnrollments(Long userId) {
        return enrollmentRepository.findByUserIdWithCourse(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Enrollment> getStudentEnrollmentsPaged(Long userId, Pageable pageable) {
        return enrollmentRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEnrolled(Long userId, Long courseId) {
        if (userId == null || courseId == null) return false;
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }
}
