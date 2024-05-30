package com.jbnu.capstone.service;

import com.jbnu.capstone.exception.CommandSendException;
import com.jbnu.capstone.exception.EmitterNotFoundException;
import com.jbnu.capstone.exception.InitialConnectionException;
import com.jbnu.capstone.exception.MachineNotRegisteredException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class SseService {
    private final MachineService machineService;

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(Long machineId) throws MachineNotRegisteredException, InitialConnectionException {
        log.info("Machine ID {}에 대한 SseEmitter 생성 요청", machineId);

        if (!machineService.isMachineRegistered(machineId)) {
            log.warn("머신 ID에 대응하는 머신이 없음: Machine ID {}", machineId);
            throw new MachineNotRegisteredException("ID가 " + machineId + "인 머신이 등록되어 있지 않습니다.");
        }

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected"));

            emitters.put(machineId, emitter);

        } catch (IOException e) {
            log.error("초기 연결 메시지 전송 실패: Machine ID {}", machineId, e);
            throw new InitialConnectionException("초기 연결 메시지 전송 실패");
        }

        emitter.onCompletion(() -> emitters.remove(machineId));
        emitter.onTimeout(() -> emitters.remove(machineId));
        emitter.onError(e -> emitters.remove(machineId));

        return emitter;
    }

    public void sendToDaemon(Long machineId, Object data) throws EmitterNotFoundException, CommandSendException {
        log.info("Machine ID {}에 명령 전송", machineId);

        SseEmitter emitter = emitters.get(machineId);

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("machineOrder")
                        .data(data));

            } catch (IOException e) {
                emitters.remove(machineId);
                log.error("명령 전송 실패: Machine ID {}", machineId, e);
                throw new CommandSendException("클라이언트에 명령을 전송하는 데 실패하였습니다.");
            }

        } else {
            log.warn("Emitter를 찾을 수 없음: Machine ID {}", machineId);
            throw new EmitterNotFoundException("해당 머신 ID에 대응하는 Emitter를 찾을 수 없습니다.");
        }
    }

}
