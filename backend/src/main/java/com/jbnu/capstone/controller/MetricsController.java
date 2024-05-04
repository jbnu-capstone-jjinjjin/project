package com.jbnu.capstone.controller;

import com.jbnu.capstone.dto.request.RequestMetricsDTO;
import com.jbnu.capstone.dto.response.ResponseDTO;
import com.jbnu.capstone.service.MetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/metrics")
@RequiredArgsConstructor
@Tag(name = "MetricsController", description = "Metrics API")
public class MetricsController {

    private final MetricsService metricsService;

    @PostMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "실패",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class)))
    })
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "메타 데이터를 추가합니다.")
    public ResponseDTO addMetrics(@RequestBody RequestMetricsDTO requestMetricsDTO) {
        metricsService.createMetrics(requestMetricsDTO);

        return new ResponseDTO(HttpStatus.OK.value(), "메타 데이터를 성공적으로 추가했습니다.");
    }

    @PatchMapping("/{id}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "실패",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class)))
    })
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "특정 id의 메타 데이터를 수정합니다.")
    public ResponseDTO updateMetrics(@PathVariable("id") Long metricsId,
                                @RequestBody RequestMetricsDTO requestMetricsDTO) {

        metricsService.updateMetrics(metricsId, requestMetricsDTO);

        return new ResponseDTO(HttpStatus.OK.value(), "특정 id의 메타 데이터를 성공적으로 수정했습니다.");
    }
}

