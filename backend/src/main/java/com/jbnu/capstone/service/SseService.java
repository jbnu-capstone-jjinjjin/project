package com.jbnu.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class SseService {
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(Long machineId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(machineId, emitter);

        emitter.onCompletion(() -> emitters.remove(machineId));
        emitter.onTimeout(() -> emitters.remove(machineId));
        emitter.onError(e -> emitters.remove(machineId));

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected"));

        } catch (IOException e) {
            emitters.remove(machineId);
            throw new RuntimeException("초기 연결 메시지 전송 실패");
        }

        return emitter;
    }

    public void sendToDaemon(Long machineId, Object data) {
        SseEmitter emitter = emitters.get(machineId);

        if (emitter != null) {
            try {
                emitter.send(data);

            } catch (IOException e) {
                emitters.remove(machineId);
                throw new RuntimeException("클라이언트에 명령을 전송하는 데 실패하였습니다.");
            }

        } else {
            throw new RuntimeException("해당 머신 ID에 대응하는 Emitter를 찾을 수 없습니다.");
        }
    }

}