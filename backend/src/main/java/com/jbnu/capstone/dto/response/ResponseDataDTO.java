package com.jbnu.capstone.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@Schema(description = "요청 결과 DTO")
public class ResponseDataDTO<T> {
    @Schema(description = "HTTP 상태 코드", example = "403")
    private Integer status;

    @Schema(description = "응답 시간", example = "2024-05-04 19:04:29")
    private String timestamp;

    @Schema(description = "메시지", example = "잘못된 요청입니다.")
    private String message;

    @Schema(description = "응답 데이터")
    private T data;

    public ResponseDataDTO(Integer status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public ResponseDataDTO(Integer status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}