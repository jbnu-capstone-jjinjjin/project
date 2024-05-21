package com.jbnu.capstone.advice;

import com.jbnu.capstone.controller.DaemonController;
import com.jbnu.capstone.dto.response.ResponseDTO;
import com.jbnu.capstone.exception.EmitterNotFoundException;
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

}
