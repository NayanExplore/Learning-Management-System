package com.skillforge.lms.controller;

import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.dto.common.PageResponse;
import com.skillforge.lms.dto.course.CourseDetailDto;
import com.skillforge.lms.dto.course.CourseSummaryDto;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/courses")
@Tag(name = "Courses", description = "Public catalog and course details")
public class CourseController {

    private final CourseService courseService;
    private final AuthService authService;

    public CourseController(CourseService courseService, AuthService authService) {
        this.courseService = courseService;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "Get paginated published courses with search and level filters")
    public ResponseEntity<ApiResponse<PageResponse<CourseSummaryDto>>> getCourses(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String level,
            @PageableDefault(size = 9, sort = "sortOrder", direction = Sort.Direction.ASC) Pageable pageable) {
        var page = courseService.getPublishedCourses(q, level, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured courses for homepage")
    public ResponseEntity<ApiResponse<List<CourseSummaryDto>>> getFeaturedCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getFeaturedCourses()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get detailed course view including curriculum and outcomes")
    public ResponseEntity<ApiResponse<CourseDetailDto>> getCourseBySlug(@PathVariable String slug) {
        User currentUser = null;
        try {
            currentUser = authService.getCurrentUser();
        } catch (Exception ignored) {
            // Unauthenticated visitor
        }
        CourseDetailDto detail = courseService.getCourseBySlug(slug, currentUser);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }
}
