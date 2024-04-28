package com.jbnu.capstone.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@Schema(description = "에러 DTO")
public class ErrorDTO {
    @Schema(description = "HTTP 상태 코드", example = "403")
    private Integer status;

    @Schema(description = "에러 메시지", example = "잘못된 요청입니다.")
    private String message;
}
