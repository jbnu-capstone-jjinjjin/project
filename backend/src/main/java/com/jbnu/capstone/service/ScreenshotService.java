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
        Machine machine = machineRepository.findById(requestScreenshotDTO.getMachineId()).orElse(null);

        if (machine == null) {
            throw new NoSuchElementException("machine not found");
        }

        Screenshot screenshot = Screenshot.builder()
                .machine(machine)
                .createdAt(requestScreenshotDTO.getCreatedAt())
                .imageName(requestScreenshotDTO.getImageName())
                .imageData(requestScreenshotDTO.getImageData())
                .build();

        screenshotRepository.save(screenshot);

        return new ResponseScreenshotDTO();
    }

    public ResponseScreenshotDetailDTO findScreenshotById(Long id) {
        Screenshot screenshot = screenshotRepository
                .findById(id).orElseThrow(() -> new NoSuchElementException("screenshot not found"));

        return new ResponseScreenshotDetailDTO(screenshot.getImageName(), screenshot.getCreatedAt(), screenshot.getImageData());
    }

    public List<ResponseScreenshotDTO> findScreenshotByMachineIdAndTimeRange(Long machineId, LocalDateTime from, LocalDateTime to) {
        return screenshotRepository.findByMachineIdAndCreatedAtBetween(machineId, from, to)
                .stream()
                .map(screenshot -> new ResponseScreenshotDTO(machineId, screenshot.getId(),
                        screenshot.getImageName(), screenshot.getCreatedAt()))
                .toList();
    }

    public void removeOldScreenshot() {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        List<Screenshot> oldScreenshot = screenshotRepository.findByCreatedAtBefore(oneDayAgo);

        if (!oldScreenshot.isEmpty()) {
            screenshotRepository.deleteAll(oldScreenshot);
        }
    }
}
