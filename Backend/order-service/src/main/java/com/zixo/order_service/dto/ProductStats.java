package com.zixo.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductStats {

    private Long productId;
    private String productName;
    private int quantitySold;
    private double revenue;
}
