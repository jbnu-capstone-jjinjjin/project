package com.jbnu.capstone.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter @Setter
@Schema(description = "응답 결과 DTO")
public class ResponseDTO {
    @Schema(description = "HTTP 상태 코드", example = "403")
    private Integer status;

    @Schema(description = "응답 시간", example = "2024-05-04 19:04:29")
    private String timestamp;

    @Schema(description = "메시지", example = "잘못된 요청입니다.")
    private String message;

    public ResponseDTO(Integer status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
