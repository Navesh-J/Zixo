package com.zixo.order_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Product ID is required")
    private Long productId;
    private String productName;
    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
    private double price;

    @Column(nullable = false)
    private String sellerUsername;
}
