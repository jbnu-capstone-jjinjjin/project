package com.jbnu.capstone.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Machine 요청 DTO")
public class RequestMachineDTO {
    @Schema(description = "기기의 이름", example = "POS")
    private String machineName;
}
