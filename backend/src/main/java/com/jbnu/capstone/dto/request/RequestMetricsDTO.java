package com.jbnu.capstone.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "메트릭 요청 DTO")
public class RequestMetricsDTO {

    @Schema(description = "기기의 고유 식별자", example = "12345")
    private Long machine_id;

    @Schema(description = "메트릭 데이터가 생성된 시간", example = "2024-05-04 19:04:29")
    private LocalDateTime createdAt;

    @Schema(description = "메트릭 유형", example = "Specs")
    private String metricType;

    @Schema(description = "메트릭의 데이터를 저장")
    private Map<String, Object> data;
}
