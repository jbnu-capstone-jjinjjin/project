package com.jbnu.capstone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestScreenshotDTO {
    private Long machineId;

    private String imageName;

    private LocalDateTime createdAt;

    private byte[] imageData;
}
