package com.jbnu.capstone.controller;

import com.jbnu.capstone.dto.request.RequestMachineDTO;
import com.jbnu.capstone.dto.response.ResponseDTO;
import com.jbnu.capstone.dto.response.ResponseDataDTO;
import com.jbnu.capstone.dto.response.ResponseMachineDTO;
import com.jbnu.capstone.dto.response.ResponseMetricsDTO;
import com.jbnu.capstone.service.MachineService;
import com.jbnu.capstone.service.MetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/machines")
@RequiredArgsConstructor
@Tag(name = "MachineController", description = "Machine API")
public class MachineController {

    private final MachineService machineService;
    private final MetricsService metricsService;

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "500", description = "실패",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class)))
    })
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "현재 등록된 모든 기기를 조회합니다.")
    public ResponseDataDTO<List<ResponseMachineDTO>> getAllMachines() {
        List<ResponseMachineDTO> machines = machineService.findAllMachines();

        return new ResponseDataDTO<>(HttpStatus.OK.value(),
                "현재 등록된 모든 기기를 성공적으로 조회했습니다.",
                machines);
    }


    @PostMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "500", description = "실패",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class)))
    })
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "메타데이터와 함께 기기를 추가합니다.")
    public ResponseDataDTO<ResponseMachineDTO> addMachine(@RequestBody RequestMachineDTO machineDTO) {
        ResponseMachineDTO machine = machineService.createMachine(machineDTO);

        return new ResponseDataDTO<>(HttpStatus.OK.value(), "기기 추가에 성공했습니다.", machine);
    }

    @GetMapping("/{id}/metrics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = @Content(schema = @Schema(implementation = ResponseDataDTO.class))),
            @ApiResponse(responseCode = "500", description = "실패",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class)))
    })
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "특정 id, 특정 시간에 해당하는 메타데이터를 가져옵니다.")
    public ResponseDataDTO<List<ResponseMetricsDTO>> getMachineMetricsTime(@PathVariable("id") Long machine_id,
                                                                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                                                                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        LocalDateTime now = LocalDateTime.now();

        if (from == null) {
            from = now.minusHours(1);
        }

        if (to == null) {
            to = now;
        }

        List<ResponseMetricsDTO> metricsDTOList = metricsService.findMetricsByMachineIdAndTimeRange(machine_id, from, to);

        return new ResponseDataDTO<>(HttpStatus.OK.value(),
                "특정 id, 특정 시간에 해당하는 메타데이터를 성공적으로 가져왔습니다.",
                metricsDTOList);
    }
}
