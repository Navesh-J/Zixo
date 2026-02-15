package com.zixo.inventory_service.service;

import com.zixo.inventory_service.exception.InsufficientStockException;
import com.zixo.inventory_service.exception.InvalidAmount;
import com.zixo.inventory_service.exception.InventoryAlreadyInitialized;
import com.zixo.inventory_service.exception.InventoryNotFoundException;
import com.zixo.inventory_service.model.Inventory;
import com.zixo.inventory_service.repo.InventoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepo repo;

    @Transactional
    public void initStock(Long productid, int quantity) {
        if (repo.existsById(productid)) {
            throw new InventoryAlreadyInitialized("Inventory already initialized");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Inventory inventory = new Inventory();
        inventory.setProductId(productid);
        inventory.setAvailableStock(quantity);
        inventory.setReservedStock(0);
        repo.save(inventory);
    }

    public Inventory getStock(Long productid) {
        return repo.findById(productid)
                .orElseThrow(()-> new InventoryNotFoundException("Inventory not found"));
    }

    @Transactional
    public void reserveStock(Long productid, int quantity) {
        Inventory inventory = getStock(productid);

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        if (inventory.getAvailableStock() < quantity) {
            throw new InsufficientStockException("Insufficient stock");
        }

        inventory.setAvailableStock(inventory.getAvailableStock() - quantity);
        inventory.setReservedStock(inventory.getReservedStock() + quantity);
        repo.save(inventory);
    }

    @Transactional
    public void confirmStock(Long productid, int quantity) {
        Inventory inventory = getStock(productid);
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        if (inventory.getReservedStock() < quantity) {
            throw new InvalidAmount("Invalid reservation amount");
        }
        inventory.setReservedStock(inventory.getReservedStock() - quantity);
        repo.save(inventory);
    }

    @Transactional
    public void releaseStock(Long productid, int quantity) {
        Inventory inventory = getStock(productid);
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        if (inventory.getReservedStock() < quantity) {
            throw new InvalidAmount("Invalid release amount");
        }

        inventory.setReservedStock(inventory.getReservedStock() - quantity);
        inventory.setAvailableStock(inventory.getAvailableStock() + quantity);
        repo.save(inventory);
    }

    @Transactional
    public void addStock(Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Inventory inventory = getStock(productId);
        inventory.setAvailableStock(inventory.getAvailableStock() + quantity);
        repo.save(inventory);
    }

    public Page<Inventory> getStocks(Pageable pageable) {
        return repo.findAll(pageable);
    }
}
