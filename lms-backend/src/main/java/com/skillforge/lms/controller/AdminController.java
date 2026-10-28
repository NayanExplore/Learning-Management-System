package com.skillforge.lms.controller;

import com.skillforge.lms.dto.admin.AdminEnrollmentDto;
import com.skillforge.lms.dto.admin.DashboardStatsDto;
import com.skillforge.lms.dto.admin.ManualEnrollmentRequest;
import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.common.PageResponse;
import com.skillforge.lms.dto.course.*;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.service.AdminService;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administration", description = "Admin dashboard, course management, student control, enrollments, and logs")
public class AdminController {

    private final AdminService adminService;
    private final CourseService courseService;
    private final AuthService authService;

    public AdminController(AdminService adminService, CourseService courseService, AuthService authService) {
        this.adminService = adminService;
        this.courseService = courseService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get overview metrics: students, courses, enrollments, revenue, certificates")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    // ==========================================
    // Course Management
    // ==========================================

    @GetMapping("/courses")
    @Operation(summary = "List and search all courses including draft, published, and archived")
    public ResponseEntity<ApiResponse<PageResponse<CourseSummaryDto>>> getAdminCourses(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Course.CourseStatus status,
            @RequestParam(required = false) Course.CourseLevel level,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getAllAdminCourses(q, status, level, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @PostMapping("/courses")
    @Operation(summary = "Create a new course with fees and details")
    public ResponseEntity<ApiResponse<CourseDetailDto>> createCourse(
            @Valid @RequestBody CourseCreateRequest request) {
        User admin = authService.getCurrentUser();
        CourseDetailDto course = courseService.createCourse(request, admin);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully", course));
    }

    @PutMapping("/courses/{id}")
    @Operation(summary = "Update an existing course and its fees")
    public ResponseEntity<ApiResponse<CourseDetailDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseCreateRequest request) {
        CourseDetailDto course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
    }

    @DeleteMapping("/courses/{id}")
    @Operation(summary = "Delete or archive a course")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        adminService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    @PatchMapping("/courses/{id}/status")
    @Operation(summary = "Change course status (DRAFT, PUBLISHED, ARCHIVED)")
    public ResponseEntity<ApiResponse<Void>> setCourseStatus(
            @PathVariable Long id,
            @RequestParam Course.CourseStatus status) {
        courseService.setCourseStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Course status updated to " + status, null));
    }

    @PostMapping("/courses/bulk-upload")
    @Operation(summary = "Bulk upload/import multiple courses with fees")
    public ResponseEntity<ApiResponse<List<CourseDetailDto>>> bulkUploadCourses(
            @Valid @RequestBody List<CourseCreateRequest> requests) {
        User admin = authService.getCurrentUser();
        List<CourseDetailDto> created = adminService.bulkUploadCourses(requests, admin);
        return ResponseEntity.ok(ApiResponse.success("Successfully imported " + created.size() + " courses", created));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload thumbnail, banner, or document for course")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "thumbnails") String folder) {
        String url = adminService.uploadFile(file, folder);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", Map.of(
                "url", url,
                "filename", file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.bin"
        )));
    }

    @PostMapping("/courses/{courseId}/sections")
    @Operation(summary = "Add a curriculum section to a course")
    public ResponseEntity<ApiResponse<CourseSectionDto>> addSection(
            @PathVariable Long courseId,
            @Valid @RequestBody SectionCreateRequest request) {
        CourseSectionDto section = courseService.addSection(courseId, request);
        return ResponseEntity.ok(ApiResponse.success("Section added successfully", section));
    }

    @PostMapping("/sections/{sectionId}/lessons")
    @Operation(summary = "Add a lesson to a course section")
    public ResponseEntity<ApiResponse<LessonDto>> addLesson(
            @PathVariable Long sectionId,
            @Valid @RequestBody LessonCreateRequest request) {
        LessonDto lesson = courseService.addLesson(sectionId, request);
        return ResponseEntity.ok(ApiResponse.success("Lesson added successfully", lesson));
    }

    @PutMapping("/lessons/{lessonId}")
    @Operation(summary = "Update a lesson")
    public ResponseEntity<ApiResponse<LessonDto>> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonCreateRequest request) {
        LessonDto lesson = courseService.updateLesson(lessonId, request);
        return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", lesson));
    }

    @DeleteMapping("/lessons/{lessonId}")
    @Operation(summary = "Delete a lesson")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long lessonId) {
        courseService.deleteLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted successfully", null));
    }

    // ==========================================
    // Student & Enrollment Management
    // ==========================================

    @GetMapping("/enrollments")
    @Operation(summary = "View all enrollments with student and course details")
    public ResponseEntity<ApiResponse<PageResponse<AdminEnrollmentDto>>> getEnrollments(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Enrollment.EnrollmentStatus status,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "enrolledAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getEnrollments(courseId, status, q, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @PostMapping("/enrollments")
    @Operation(summary = "Manually enroll a student into a course")
    public ResponseEntity<ApiResponse<AdminEnrollmentDto>> manualEnrollStudent(
            @Valid @RequestBody ManualEnrollmentRequest request) {
        AdminEnrollmentDto enrollment = adminService.manualEnrollStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student successfully enrolled in course", enrollment));
    }

    @PatchMapping("/enrollments/{id}/status")
    @Operation(summary = "Update enrollment status (ACTIVE, COMPLETED, SUSPENDED)")
    public ResponseEntity<ApiResponse<Void>> updateEnrollmentStatus(
            @PathVariable Long id,
            @RequestParam Enrollment.EnrollmentStatus status) {
        adminService.updateEnrollmentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Enrollment status updated to " + status, null));
    }

    @DeleteMapping("/enrollments/{id}")
    @Operation(summary = "Unenroll student / delete enrollment")
    public ResponseEntity<ApiResponse<Void>> deleteEnrollment(@PathVariable Long id) {
        adminService.deleteEnrollment(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment removed successfully", null));
    }

    @GetMapping("/students")
    @Operation(summary = "List and search students")
    public ResponseEntity<ApiResponse<PageResponse<User>>> getStudents(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getStudents(q, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @PatchMapping("/students/{id}/status")
    @Operation(summary = "Enable or disable a student account")
    public ResponseEntity<ApiResponse<Void>> updateStudentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        adminService.setUserEnabled(id, enabled);
        return ResponseEntity.ok(ApiResponse.success("Student status updated", null));
    }

    @GetMapping("/orders")
    @Operation(summary = "View all orders and payments")
    public ResponseEntity<ApiResponse<PageResponse<Order>>> getAllOrders(
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getAllOrders(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Inspect multi-channel notification logs and delivery statuses")
    public ResponseEntity<ApiResponse<PageResponse<NotificationLog>>> getNotificationLogs(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getNotificationLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "View administrative audit log history")
    public ResponseEntity<ApiResponse<PageResponse<AuditLog>>> getAuditLogs(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        var page = adminService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }
}
