package com.zixo.product_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateProductRequest {

    @NotNull
    private String productName;
    private String productDescription;

    @NotNull
    private Double price;

    @NotNull
    @Min(1)
    private Integer initialStock;
}
