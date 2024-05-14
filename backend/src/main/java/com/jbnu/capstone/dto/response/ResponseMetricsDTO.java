package com.jbnu.capstone.dto.response;

import com.jbnu.capstone.entity.MetricsType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "메트릭 응답 DTO")
public class ResponseMetricsDTO {

    @Schema(description = "고유 식별자", example = "12345")
    private Long metricsId;

    @Schema(description = "메트릭 유형", example = "Specs")
    private MetricsType metricsType;

    @Schema(description = "응답 시간", example = "2024-05-04 19:04:29")
    private LocalDateTime createdAt;

    @Schema(description = "메트릭의 데이터를 저장")
    private Map<String, Object> data;

    public ResponseMetricsDTO(Long metricsId, MetricsType metricsType, LocalDateTime createdAt, Map<String, Object> data) {
        this.metricsId = metricsId;
        this.metricsType = metricsType;
        this.createdAt = createdAt;
        this.data = data;
    }
}
