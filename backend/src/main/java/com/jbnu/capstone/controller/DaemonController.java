package com.jbnu.capstone.controller;

import com.jbnu.capstone.dto.request.RequestDaemonCommandDTO;
import com.jbnu.capstone.dto.request.RequestMachineConnectionDTO;
import com.jbnu.capstone.dto.response.ResponseDTO;
import com.jbnu.capstone.exception.CommandSendException;
import com.jbnu.capstone.exception.EmitterNotFoundException;
import com.jbnu.capstone.exception.InitialConnectionException;
import com.jbnu.capstone.exception.MachineNotRegisteredException;
import com.jbnu.capstone.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/daemon")
public class DaemonController {
    private final SseService sseService;

    @GetMapping("/connect")
    @ResponseStatus(HttpStatus.OK)
    public SseEmitter connectDaemon(@RequestBody RequestMachineConnectionDTO requestMachineConnectionDTO) throws MachineNotRegisteredException, InitialConnectionException {
        return sseService.createEmitter(requestMachineConnectionDTO.getMachineId());
    }

    @PostMapping("/control")
    @ResponseStatus(HttpStatus.OK)
    public ResponseDTO controlDaemon(@RequestBody RequestDaemonCommandDTO requestDaemonCommandDTO) throws EmitterNotFoundException, CommandSendException {
        sseService.sendToDaemon(requestDaemonCommandDTO.getMachineId(), requestDaemonCommandDTO.getControl());

        return new ResponseDTO(HttpStatus.OK.value(), "명령 제어 전송에 성공했습니다.");
    }
}
