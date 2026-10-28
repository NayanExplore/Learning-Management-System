package com.skillforge.lms.security;

import com.skillforge.lms.dto.admin.DashboardStatsDto;
import com.skillforge.lms.dto.certificate.CertificateVerifyResponseDto;
import com.skillforge.lms.dto.course.CourseSummaryDto;
import com.skillforge.lms.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @MockBean
    private CertificateService certificateService;

    @MockBean
    private AdminService adminService;

    @MockBean
    private AuthService authService;

    @Test
    void publicCourses_PermitAll() throws Exception {
        when(courseService.getPublishedCourses(any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of(
                        CourseSummaryDto.builder()
                                .id(1L)
                                .title("Intro to React")
                                .slug("intro-to-react")
                                .price(BigDecimal.valueOf(1999))
                                .level("BEGINNER")
                                .build()
                )));

        mockMvc.perform(get("/api/v1/courses")
                        .contextPath("/api")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void publicCertificateVerify_PermitAll() throws Exception {
        when(certificateService.verifyCertificate("SF-VALID-123"))
                .thenReturn(CertificateVerifyResponseDto.builder()
                        .valid(true)
                        .certificateId("SF-VALID-123")
                        .studentName("Priya Sharma")
                        .courseTitle("Full-Stack Bootcamp")
                        .issuer("SkillForge Academy")
                        .build());

        mockMvc.perform(get("/api/v1/certificates/verify/SF-VALID-123")
                        .contextPath("/api")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.valid").value(true))
                .andExpect(jsonPath("$.data.studentName").value("Priya Sharma"));
    }

    @Test
    void adminDashboard_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .contextPath("/api"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
    void adminDashboard_StudentRole_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .contextPath("/api"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void adminDashboard_AdminRole_ReturnsSuccess() throws Exception {
        when(adminService.getDashboardStats()).thenReturn(DashboardStatsDto.builder()
                .totalStudents(120)
                .publishedCourses(5)
                .totalRevenue(BigDecimal.valueOf(50000))
                .build());

        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .contextPath("/api"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalStudents").value(120));
    }
}
