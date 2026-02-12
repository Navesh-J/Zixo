package com.zixo.order_service.model;

public enum OrderStatus {
    CREATED,
    INVENTORY_RESERVED,
    PAYMENT_PENDING,
    COMPLETED,
    FAILED,
    CANCELLED
}