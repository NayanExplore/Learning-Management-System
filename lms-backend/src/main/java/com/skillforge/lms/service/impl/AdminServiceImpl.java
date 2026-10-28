package com.skillforge.lms.service.impl;

import com.skillforge.lms.dto.admin.AdminEnrollmentDto;
import com.skillforge.lms.dto.admin.DashboardStatsDto;
import com.skillforge.lms.dto.admin.ManualEnrollmentRequest;
import com.skillforge.lms.dto.course.CourseCreateRequest;
import com.skillforge.lms.dto.course.CourseDetailDto;
import com.skillforge.lms.dto.course.CourseSummaryDto;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.repository.*;
import com.skillforge.lms.service.AdminService;
import com.skillforge.lms.service.CourseService;
import com.skillforge.lms.service.EnrollmentService;
import com.skillforge.lms.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderRepository orderRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final AuditLogRepository auditLogRepository;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final FileStorageService fileStorageService;

    public AdminServiceImpl(UserRepository userRepository,
                            CourseRepository courseRepository,
                            EnrollmentRepository enrollmentRepository,
                            OrderRepository orderRepository,
                            CertificateRepository certificateRepository,
                            NotificationLogRepository notificationLogRepository,
                            AuditLogRepository auditLogRepository,
                            CourseService courseService,
                            EnrollmentService enrollmentService,
                            FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderRepository = orderRepository;
        this.certificateRepository = certificateRepository;
        this.notificationLogRepository = notificationLogRepository;
        this.auditLogRepository = auditLogRepository;
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalStudents = userRepository.countByRole(User.Role.STUDENT);
        long publishedCourses = courseRepository.countByStatus(Course.CourseStatus.PUBLISHED);
        long totalEnrollments = enrollmentRepository.count();
        long totalOrders = orderRepository.count();
        long totalCerts = certificateRepository.count();

        // Calculate total revenue from PAID orders
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PAID)
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .publishedCourses(publishedCourses)
                .totalEnrollments(totalEnrollments)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .totalCertificatesIssued(totalCerts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> getStudents(String query, Pageable pageable) {
        if (StringUtils.hasText(query)) {
            return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    query.trim(), query.trim(), pageable);
        }
        return userRepository.findByRole(User.Role.STUDENT, pageable);
    }

    @Override
    @Transactional
    public void setUserEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationLog> getNotificationLogs(Pageable pageable) {
        return notificationLogRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminEnrollmentDto> getEnrollments(Long courseId, Enrollment.EnrollmentStatus status, String query, Pageable pageable) {
        String cleanQuery = StringUtils.hasText(query) ? query.trim() : null;
        Page<Enrollment> page = enrollmentRepository.findFilteredEnrollments(courseId, status, cleanQuery, pageable);
        return page.map(AdminEnrollmentDto::fromEntity);
    }

    @Override
    @Transactional
    public AdminEnrollmentDto manualEnrollStudent(ManualEnrollmentRequest request) {
        if (request.getCourseId() == null) {
            throw new BadRequestException("Course ID is required for enrollment");
        }
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        User student;
        if (request.getUserId() != null) {
            student = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));
        } else if (StringUtils.hasText(request.getEmail())) {
            student = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
        } else {
            throw new BadRequestException("Either student ID or email must be provided");
        }

        Enrollment enrollment = enrollmentService.enrollStudent(student, course);
        return AdminEnrollmentDto.fromEntity(enrollment);
    }

    @Override
    @Transactional
    public void updateEnrollmentStatus(Long enrollmentId, Enrollment.EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", enrollmentId));
        enrollment.setStatus(status);
        if (status == Enrollment.EnrollmentStatus.COMPLETED && enrollment.getCompletedAt() == null) {
            enrollment.setCompletedAt(LocalDateTime.now());
            enrollment.setProgressPct(BigDecimal.valueOf(100.00));
        } else if (status == Enrollment.EnrollmentStatus.ACTIVE && enrollment.getCompletedAt() != null) {
            enrollment.setCompletedAt(null);
        }
        enrollmentRepository.save(enrollment);
        log.info("Updated enrollment {} status to {}", enrollmentId, status);
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", enrollmentId));
        Course course = enrollment.getCourse();
        if (course != null && course.getEnrollmentCount() > 0) {
            course.setEnrollmentCount(course.getEnrollmentCount() - 1);
            courseRepository.save(course);
        }
        enrollmentRepository.delete(enrollment);
        log.info("Deleted enrollment ID {}", enrollmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseSummaryDto> getAllAdminCourses(String query, Course.CourseStatus status, Course.CourseLevel level, Pageable pageable) {
        String cleanQuery = StringUtils.hasText(query) ? query.trim() : null;
        Page<Course> page = courseRepository.searchAdminCourses(status, level, cleanQuery, pageable);
        return page.map(CourseSummaryDto::fromEntity);
    }

    @Override
    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        long enrollments = enrollmentRepository.countByCourseId(courseId);
        if (enrollments > 0) {
            // Soft-delete / Archive if active student enrollments exist
            course.setStatus(Course.CourseStatus.ARCHIVED);
            courseRepository.save(course);
            log.info("Course {} has {} enrollments, archived instead of hard-deleted", courseId, enrollments);
        } else {
            courseRepository.delete(course);
            log.info("Course {} hard-deleted", courseId);
        }
    }

    @Override
    @Transactional
    public List<CourseDetailDto> bulkUploadCourses(List<CourseCreateRequest> requests, User admin) {
        if (requests == null || requests.isEmpty()) {
            throw new BadRequestException("Course list cannot be empty");
        }
        List<CourseDetailDto> created = new ArrayList<>();
        for (CourseCreateRequest req : requests) {
            try {
                CourseDetailDto dto = courseService.createCourse(req, admin);
                created.add(dto);
            } catch (Exception e) {
                log.error("Failed to import course '{}': {}", req.getTitle(), e.getMessage());
                throw new BadRequestException("Failed importing course '" + req.getTitle() + "': " + e.getMessage());
            }
        }
        return created;
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.bin");
        String extension = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx > 0) {
            extension = originalFilename.substring(dotIdx);
        }

        String safeFolder = StringUtils.hasText(folder) ? folder.replaceAll("[^a-zA-Z0-9_-]", "") : "courses";
        String uniqueKey = safeFolder + "/" + UUID.randomUUID() + extension;

        try (InputStream in = file.getInputStream()) {
            fileStorageService.uploadFile(uniqueKey, in, file.getSize(), file.getContentType());
            return fileStorageService.getPresignedUrl(uniqueKey);
        } catch (Exception e) {
            log.error("Failed to upload file {}: {}", originalFilename, e.getMessage());
            throw new BadRequestException("File upload failed: " + e.getMessage());
        }
    }
}
