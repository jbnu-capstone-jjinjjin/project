package com.jbnu.capstone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseScreenshotDTO {
    private Long machineId;
    private Long screenshotId;
    private String imageName;
    private LocalDateTime createdAt;
}
