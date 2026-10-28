package com.skillforge.lms.repository;

import com.skillforge.lms.entity.NotificationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    Page<NotificationLog> findByChannel(NotificationLog.Channel channel, Pageable pageable);
    Page<NotificationLog> findByStatus(NotificationLog.NotifStatus status, Pageable pageable);
    Page<NotificationLog> findByUserId(Long userId, Pageable pageable);
}
