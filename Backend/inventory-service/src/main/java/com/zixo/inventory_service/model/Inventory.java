package com.zixo.inventory_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    private Long productId;

    @Column(nullable = false)
    private Integer availableStock = 0;

    @Column(nullable = false)
    private Integer reservedStock = 0;

    @Version
    private Long version;
}
