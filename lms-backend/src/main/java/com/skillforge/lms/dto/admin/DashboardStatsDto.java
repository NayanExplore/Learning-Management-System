package com.skillforge.lms.dto.admin;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long publishedCourses;
    private long totalEnrollments;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long totalCertificatesIssued;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalStudents, long publishedCourses, long totalEnrollments, long totalOrders, BigDecimal totalRevenue, long totalCertificatesIssued) {
        this.totalStudents = totalStudents;
        this.publishedCourses = publishedCourses;
        this.totalEnrollments = totalEnrollments;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalCertificatesIssued = totalCertificatesIssued;
    }
}
