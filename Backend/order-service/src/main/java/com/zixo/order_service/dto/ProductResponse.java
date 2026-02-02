package com.zixo.order_service.dto;

import lombok.Data;

@Data
public class ProductResponse {
    private Long productId;
    private String productName;
    private String productDescription;
    private Double price;
    private Integer stock;
}
