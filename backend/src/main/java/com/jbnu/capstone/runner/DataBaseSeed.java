package com.jbnu.capstone.runner;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jbnu.capstone.entity.Machine;
import com.jbnu.capstone.entity.Metrics;
import com.jbnu.capstone.entity.MetricsType;
import com.jbnu.capstone.repository.MachineRepository;
import com.jbnu.capstone.repository.MetricsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@Transactional
@RequiredArgsConstructor
public class DataBaseSeed implements ApplicationRunner {

    private final MachineRepository machineRepository;
    private final MetricsRepository metricsRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<String> machineNameList = new ArrayList<>(List.of(
                "machine1", "machine2", "machine3", "machine4", "machine5",
                "machine6", "machine7", "machine8", "machine9", "machine10"
        ));

        for (String machineName : machineNameList) {
            Machine machine = Machine.builder()
                    .machineName(machineName)
                    .uuid(UUID.randomUUID())
                    .build();

            machineRepository.save(machine);

            String jsonData = """
                {
                    "identifier": "%s",
                    "cpu": {
                        "model": "12th Gen Intel(R) Core(TM) i5-1240P",
                        "speed": 2112,
                        "cores": 16
                    },
                    "ram": {
                        "total": 16880881664
                    },
                    "gpu": [
                        {
                            "model": "NVIDIA GeForce RTX 2050",
                            "vram": 4096
                        },
                        {
                            "model": "Intel(R) Iris(R) Xe Graphics",
                            "vram": 1024
                        }
                    ],
                    "disk": [
                        {
                            "fs": "C:",
                            "type": "NTFS",
                            "size": 1022986080256,
                            "used": 266635317248,
                            "available": 756350763008,
                            "use": 26.06,
                            "mount": "C:",
                            "rw": true
                        },
                        {
                            "fs": "D:",
                            "type": "NTFS",
                            "size": 256059109376,
                            "used": 105836544,
                            "available": 255953272832,
                            "use": 0.04,
                            "mount": "D:",
                            "rw": true
                        },
                        {
                            "fs": "T:",
                            "type": "NTFS",
                            "size": 523235328,
                            "used": 14626816,
                            "available": 508608512,
                            "use": 2.8,
                            "mount": "T:",
                            "rw": true
                        }
                    ],
                    "network": [
                        {
                            "iface": "Tailscale",
                            "mac": "00:00:00:00:00:00",
                            "ip4": "100.75.5.74"
                        },
                        {
                            "iface": "이더넷",
                            "mac": "0a:00:27:00:00:0e",
                            "ip4": "192.168.56.1"
                        },
                        {
                            "iface": "Wi-Fi",
                            "mac": "8c:17:59:f0:d5:d4",
                            "ip4": "10.55.43.91"
                        },
                        {
                            "iface": "Loopback Pseudo-Interface 1",
                            "mac": "00:00:00:00:00:00",
                            "ip4": "127.0.0.1"
                        },
                        {
                            "iface": "vEthernet (WSL)",
                            "mac": "00:15:5d:e1:57:0f",
                            "ip4": "192.168.160.1"
                        },
                        {
                            "iface": "Bluetooth 네트워크 연결",
                            "mac": "8c:17:59:f0:d5:d8",
                            "ip4": ""
                        },
                        {
                            "iface": "Tailscale",
                            "mac": "",
                            "ip4": ""
                        }
                    ],
                    "os": {
                        "platform": "win32",
                        "release": "10.0.19045",
                        "hostname": "DESKTOP-T2D6PKV"
                    }
                }
                """.formatted(UUID.randomUUID().toString());

            Map<String, Object> dataMap = objectMapper.readValue(jsonData, new TypeReference<Map<String, Object>>(){});

            Metrics metrics = Metrics.builder()
                    .metricType(MetricsType.HW_INFO)
                    .machine(machine)
                    .data(dataMap)
                    .createdAt(LocalDateTime.now())
                    .build();

            metricsRepository.save(metrics);
        }
    }
}
