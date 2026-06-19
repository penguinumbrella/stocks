/**
 * Global Exception Handler
 * 
 * This exists to provide custom error messages to the front-end if something wrong occurs.
 * Handles:
 *      - Validation Fails
 *          - duplicate tickers
 *          - prices <= 0
 *          - null fields
 *      - Conflict errors (409s)
 *      - Custom Delete error (404) if id doesn't exist in DB
 * 
 * It only returns information that is necessary to the user/frontend to protect our backend logic's internal workings.
 * 
 */

package com.java.skillstorm.stocks.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Single exception handler to handle custom exceptions thrown from Service class
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleErrorResponse(ResponseStatusException e) {

        // map to hold information
        HashMap<String, Object> response = new HashMap<>();
        
        response.put("status", e.getStatusCode().value()); // status
        response.put("message", e.getReason()); // message

        return ResponseEntity.status(e.getStatusCode()).body(response);

    }
    
}
