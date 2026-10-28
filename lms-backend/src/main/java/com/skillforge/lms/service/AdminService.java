package com.skillforge.lms.service;

import com.skillforge.lms.dto.admin.AdminEnrollmentDto;
import com.skillforge.lms.dto.admin.DashboardStatsDto;
import com.skillforge.lms.dto.admin.ManualEnrollmentRequest;
import com.skillforge.lms.dto.course.CourseCreateRequest;
import com.skillforge.lms.dto.course.CourseDetailDto;
import com.skillforge.lms.dto.course.CourseSummaryDto;
import com.skillforge.lms.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminService {
    DashboardStatsDto getDashboardStats();
    Page<User> getStudents(String query, Pageable pageable);
    void setUserEnabled(Long userId, boolean enabled);
    Page<Order> getAllOrders(Pageable pageable);
    Page<NotificationLog> getNotificationLogs(Pageable pageable);
    Page<AuditLog> getAuditLogs(Pageable pageable);

    // Enrollments Management
    Page<AdminEnrollmentDto> getEnrollments(Long courseId, Enrollment.EnrollmentStatus status, String query, Pageable pageable);
    AdminEnrollmentDto manualEnrollStudent(ManualEnrollmentRequest request);
    void updateEnrollmentStatus(Long enrollmentId, Enrollment.EnrollmentStatus status);
    void deleteEnrollment(Long enrollmentId);

    // Courses Management
    Page<CourseSummaryDto> getAllAdminCourses(String query, Course.CourseStatus status, Course.CourseLevel level, Pageable pageable);
    void deleteCourse(Long courseId);
    List<CourseDetailDto> bulkUploadCourses(List<CourseCreateRequest> requests, User admin);

    // File / Media Upload
    String uploadFile(MultipartFile file, String folder);
}
