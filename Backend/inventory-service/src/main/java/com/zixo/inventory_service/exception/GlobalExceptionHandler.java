package com.zixo.inventory_service.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InventoryNotFoundException.class)
    public ResponseEntity<String> handleInventoryNotFoundException(InventoryNotFoundException ex){
        return ResponseEntity.status(404).body("Inventory not found");
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<String> handleInsufficientStockException(InsufficientStockException ex){
        return ResponseEntity.badRequest().body("Insufficient stock");
    }

    @ExceptionHandler(InventoryAlreadyInitialized.class)
    public ResponseEntity<String> handleInventoryAlreadyInitializedException(InventoryAlreadyInitialized ex){
        return ResponseEntity.badRequest().body("Inventory already initialized");
    }

    @ExceptionHandler(InvalidAmount.class)
    public ResponseEntity<String> handleInvalidAmount(InvalidAmount ex){
        return ResponseEntity.badRequest().body("Invalid amount");
    }
}
