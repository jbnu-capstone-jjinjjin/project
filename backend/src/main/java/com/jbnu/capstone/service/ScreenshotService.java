package com.jbnu.capstone.service;

import com.jbnu.capstone.dto.request.RequestScreenshotDTO;
import com.jbnu.capstone.dto.response.ResponseScreenshotDTO;
import com.jbnu.capstone.dto.response.ResponseScreenshotDetailDTO;
import com.jbnu.capstone.entity.Machine;
import com.jbnu.capstone.entity.Screenshot;
import com.jbnu.capstone.repository.MachineRepository;
import com.jbnu.capstone.repository.ScreenshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScreenshotService {

    private final ScreenshotRepository screenshotRepository;
    private final MachineRepository machineRepository;

    public ResponseScreenshotDTO createScreenshot(RequestScreenshotDTO requestScreenshotDTO) {
        log.info("스크린 샷 추가 : [Machine ID : {}]", requestScreenshotDTO.getMachineId());

        Machine machine = machineRepository.findById(requestScreenshotDTO.getMachineId()).orElse(null);

        if (machine == null) {
            log.warn("머신 ID에 대응하는 머신이 없음 : [Machine ID : {}]", requestScreenshotDTO.getMachineId());
            throw new NoSuchElementException("machine not found");
        }

        Screenshot screenshot = Screenshot.builder()
                .machine(machine)
                .createdAt(requestScreenshotDTO.getCreatedAt())
                .imageName(requestScreenshotDTO.getImageName())
                .imageData(requestScreenshotDTO.getImageData())
                .build();

        screenshotRepository.save(screenshot);

        log.info("스크린샷 저장 완료 : [Machine ID : {}, Image Name : {}]", requestScreenshotDTO.getMachineId(), requestScreenshotDTO.getImageName());

        return new ResponseScreenshotDTO();
    }

    public ResponseScreenshotDetailDTO findScreenshotById(Long id) {
        log.info("스크린 샷 조회 : [Screenshot ID : {}]", id);

        Screenshot screenshot = screenshotRepository
                .findById(id)
                .orElseThrow(() -> {
                    log.warn("스크린 샷을 찾을 수 없음 : [Screenshot ID : {}]", id);
                    return new NoSuchElementException("screenshot not found");
                });

        return new ResponseScreenshotDetailDTO(screenshot.getImageName(), screenshot.getCreatedAt(), screenshot.getImageData());
    }

    public List<ResponseScreenshotDTO> findScreenshotByMachineIdAndTimeRange(Long machineId, LocalDateTime from, LocalDateTime to) {
        log.info("특정 시간 범위의 스크린 샷 조회 : [Machine ID : {}, From : {}, To : {}]", machineId, from, to);

        return screenshotRepository.findByMachineIdAndCreatedAtBetween(machineId, from, to)
                .stream()
                .map(screenshot -> new ResponseScreenshotDTO(machineId, screenshot.getId(),
                        screenshot.getImageName(), screenshot.getCreatedAt()))
                .toList();
    }

    public void removeOldScreenshot() {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);

        log.info("하루 이전 스크린 샷 삭제");

        screenshotRepository.deleteByCreatedAtBefore(oneDayAgo);
    }
}
