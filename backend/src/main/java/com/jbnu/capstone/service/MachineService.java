package com.jbnu.capstone.service;

import com.jbnu.capstone.dto.request.RequestMachineDTO;
import com.jbnu.capstone.dto.response.ResponseMachineDTO;
import com.jbnu.capstone.entity.Machine;
import com.jbnu.capstone.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MachineService {

    private final MachineRepository machineRepository;

    public ResponseMachineDTO createMachine(RequestMachineDTO machineDTO) {
        Machine machine = Machine.builder()
                .machineName(machineDTO.getMachineName())
                .build();

        Machine savedMachine = machineRepository.save(machine);

        return new ResponseMachineDTO(savedMachine.getId(), savedMachine.getMachineName());
    }

    public List<ResponseMachineDTO> findAllMachines() {
        List<Machine> machines = machineRepository.findAll();

        return machines.stream()
                .map(machine -> new ResponseMachineDTO(machine.getId(), machine.getMachineName()))
                .toList();
    }

}
