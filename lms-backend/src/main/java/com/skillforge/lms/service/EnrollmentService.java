package com.skillforge.lms.service;

import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.Enrollment;
import com.skillforge.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EnrollmentService {
    Enrollment enrollStudent(User user, Course course);
    Enrollment getEnrollment(Long userId, Long courseId);
    List<Enrollment> getStudentEnrollments(Long userId);
    Page<Enrollment> getStudentEnrollmentsPaged(Long userId, Pageable pageable);
    boolean isEnrolled(Long userId, Long courseId);
}
