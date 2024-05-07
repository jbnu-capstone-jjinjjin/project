package com.jbnu.capstone.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Machine Response DTO")
public class ResponseMachineDTO {
    @Schema(description = "고유 식별자", example = "12345")
    private Long machine_id;

    @Schema(description = "기기의 이름", example = "POS")
    private String machineName;
}
