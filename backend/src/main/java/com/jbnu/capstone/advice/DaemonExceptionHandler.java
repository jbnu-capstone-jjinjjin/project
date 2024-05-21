package com.jbnu.capstone.advice;

import com.jbnu.capstone.controller.DaemonController;
import com.jbnu.capstone.dto.response.ResponseDTO;
import com.jbnu.capstone.exception.CommandSendException;
import com.jbnu.capstone.exception.EmitterNotFoundException;
import com.jbnu.capstone.exception.MachineNotRegisteredException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = DaemonController.class)
public class DaemonExceptionHandler {

    @ExceptionHandler(EmitterNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseDTO handleEmitterNotFoundException(EmitterNotFoundException ex) {
        return new ResponseDTO(HttpStatus.NOT_FOUND.value(), ex.getMessage());
    }

    @ExceptionHandler(CommandSendException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseDTO handleCommandSendException(CommandSendException ex) {
        return new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
    }

    @ExceptionHandler(MachineNotRegisteredException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseDTO handleMachineNotRegisteredException(MachineNotRegisteredException ex) {
        return new ResponseDTO(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
    }

}
