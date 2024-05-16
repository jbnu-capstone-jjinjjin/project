package com.jbnu.capstone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestDaemonCommandDTO {
    private Long machineId;
    private Control control;

    @Getter @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    static class Control {
        private String command;
        private List<String> args;
    }
}
