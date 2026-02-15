package com.zixo.inventory_service.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class StockRequest {
    private Long productId;

    @Min(1)
    private Integer quantity;
}
