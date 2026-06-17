package com.java.skillstorm.stocks.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleErrorResponse(ResponseStatusException e) {

        HashMap<String, Object> response = new HashMap<>();
        
        response.put("status", e.getStatusCode().value());
        response.put("message", e.getReason());

        return ResponseEntity.status(e.getStatusCode()).body(response);

    }
    
}
