package com.jbnu.capstone.service;

import com.jbnu.capstone.dto.request.RequestMetricsDTO;
import com.jbnu.capstone.dto.request.RequestUpdateMetricsDTO;
import com.jbnu.capstone.dto.response.ResponseMetricsDTO;
import com.jbnu.capstone.entity.Machine;
import com.jbnu.capstone.entity.Metrics;
import com.jbnu.capstone.repository.MachineRepository;
import com.jbnu.capstone.repository.MetricsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MetricsService {

    private final MetricsRepository metricsRepository;
    private final MachineRepository machineRepository;
    
    public void createMetrics(RequestMetricsDTO requestMetricsDTO) {

        Machine machine = machineRepository.findById(requestMetricsDTO.getMachineId()).orElse(null);

        if (machine == null) {
            throw new RuntimeException("Machine not found");
        }

        Metrics metrics = Metrics.builder()
                .machine(machine)
                .metricType(requestMetricsDTO.getMetricType())
                .createdAt(requestMetricsDTO.getCreatedAt())
                .data(requestMetricsDTO.getData())
                .build();

        metricsRepository.save(metrics);
    }

    public void updateMetrics(Long metricsId, RequestUpdateMetricsDTO requestUpdateMetricsDTO) {
        Metrics metrics = metricsRepository.findById(metricsId).orElse(null);

        if (metrics == null) {
            throw new RuntimeException("Metric not found");
        }

        metrics.setData(requestUpdateMetricsDTO.getData());
        metricsRepository.save(metrics);
    }

    public List<ResponseMetricsDTO> findMetricsByMachineIdAndTimeRange(Long machineId, LocalDateTime from, LocalDateTime to) {
        return metricsRepository.findByMachineIdAndCreatedAtBetween(machineId, from, to)
                .stream()
                .map(metric -> new ResponseMetricsDTO(metric.getId(), metric.getMetricType(), metric.getCreatedAt(), metric.getData()))
                .toList();
    }
}

