package com.zixo.inventory_service.exception;

public class InventoryAlreadyInitialized extends RuntimeException {
    public InventoryAlreadyInitialized(String message) {
        super(message);
    }
}
