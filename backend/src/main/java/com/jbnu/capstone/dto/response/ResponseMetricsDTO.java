package com.jbnu.capstone.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "메트릭 응답 DTO")
public class ResponseMetricsDTO {

    @Schema(description = "고유 식별자", example = "12345")
    private Long metrics_id;

    @Schema(description = "메트릭 유형", example = "Specs")
    private String metricType;

    @Schema(description = "메트릭의 데이터를 저장")
    private Map<String, Object> data;
}
