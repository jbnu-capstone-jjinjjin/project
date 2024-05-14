package com.jbnu.capstone.controller;

import com.jbnu.capstone.dto.request.RequestScreenshotDTO;
import com.jbnu.capstone.dto.response.*;
import com.jbnu.capstone.service.ScreenshotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/screenshot")
@RequiredArgsConstructor
public class ScreenshotController {

    private final ScreenshotService screenshotService;

    @PostMapping
    public ResponseEntity<ResponseDTO> addScreenshot(@RequestParam MultipartFile imageData,
                                     @RequestParam String imageName,
                                     @RequestParam LocalDateTime createdAt,
                                     @RequestParam Long machineId) throws IOException {

        if (!MediaType.IMAGE_PNG_VALUE.equals(imageData.getContentType())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ResponseDTO(HttpStatus.BAD_REQUEST.value(), "잘못된 파일 형식입니다."));
        }

        RequestScreenshotDTO requestScreenshotDTO = new RequestScreenshotDTO(machineId, imageName, createdAt, imageData.getBytes());
        ResponseScreenshotDTO screenshot = screenshotService.createScreenshot(requestScreenshotDTO);

        return ResponseEntity
                .ok(new ResponseDTO(HttpStatus.OK.value(), "스크린샷 저장에 성공했습니다."));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<ResponseDataDTO<ResponseScreenshotDetailDTO>> getScreenshot(@PathVariable("id") Long screenshotId) {
        ResponseScreenshotDetailDTO screenshot = screenshotService.findScreenshotById(screenshotId);

        return ResponseEntity
                .ok()
                .body(new ResponseDataDTO<>(200, "특정 id의 이미지 조회에 성공", screenshot));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseDataDTO<List<ResponseScreenshotDTO>> getScreenshotsByIdAndTimeRange(@PathVariable("id") Long machineId,
                                                                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                                                                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        LocalDateTime now = LocalDateTime.now();

        if (from == null) {
            from = now.minusHours(1);
        }

        if (to == null) {
            to = now;
        }

        List<ResponseScreenshotDTO> screenshotDTOList = screenshotService.findScreenshotByMachineIdAndTimeRange(machineId, from, to);

        return new ResponseDataDTO<>(HttpStatus.OK.value(),
                "특정 id, 특정 시간에 해당하는 스크린샷을 성공적으로 가져왔습니다.",
                screenshotDTOList);
    }

    /**
     * 매일 자정에 해당 작업 실행 -> 00:00:00
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteOldScreenshot() {
        screenshotService.removeOldScreenshot();
    }
}
