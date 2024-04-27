package com.jbnu.capstone.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.jbnu.capstone.dto.ErrorDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "TestController", description = "테스트 API")
public class TestController {
    
    @GetMapping(value = "/echo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "403", description = "실패",
                    content = @Content(schema = @Schema(implementation = ErrorDTO.class)))
    })
    @Operation(summary = "요청 테스트")
    public String echo() {
        return "캡스톤 프로젝트!!";
    }
}
