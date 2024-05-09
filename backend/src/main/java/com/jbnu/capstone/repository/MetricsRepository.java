package com.jbnu.capstone.repository;

import com.jbnu.capstone.entity.Metrics;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MetricsRepository extends CrudRepository<Metrics, Long> {

    List<Metrics> findByMachineIdAndCreatedAtBetween(Long machineId, LocalDateTime from, LocalDateTime to);
}
