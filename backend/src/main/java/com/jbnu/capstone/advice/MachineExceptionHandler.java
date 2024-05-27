package com.jbnu.capstone.advice;

import com.jbnu.capstone.controller.MachineController;
import com.jbnu.capstone.dto.response.ResponseDTO;
import com.jbnu.capstone.exception.InvalidTypeParameterException;
import com.jbnu.capstone.exception.MachineNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice(assignableTypes = MachineController.class )
public class MachineExceptionHandler {

    @ExceptionHandler(MachineNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseDTO machineNotFound(MachineNotFoundException e) {
        return new ResponseDTO(HttpStatus.NOT_FOUND.value(), e.getMessage());
    }

    @ExceptionHandler(InvalidTypeParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseDTO invalidTypeParameter(InvalidTypeParameterException e) {
        return new ResponseDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
    }
}
