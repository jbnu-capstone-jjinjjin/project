package com.jbnu.capstone.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseScreenshotDetailDTO {
    private String imageName;
    private LocalDateTime createdAt;
    private byte[] imageData;
}
