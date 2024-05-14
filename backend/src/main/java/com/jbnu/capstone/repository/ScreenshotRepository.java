package com.jbnu.capstone.repository;

import com.jbnu.capstone.entity.Screenshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ScreenshotRepository extends JpaRepository<Screenshot, Long> {

    List<Screenshot> findByMachineIdAndCreatedAtBetween(Long machineId, LocalDateTime from, LocalDateTime to);
    void deleteByCreatedAtBefore(LocalDateTime createdAt);
}
