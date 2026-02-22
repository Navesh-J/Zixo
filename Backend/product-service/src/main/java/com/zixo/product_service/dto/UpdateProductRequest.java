package com.zixo.product_service.dto;

import lombok.Data;

@Data
public class UpdateProductRequest {

    private String productName;
    private String productDescription;
    private Double price;
    private Integer additionalStock;
    private String imageUrl;
}
