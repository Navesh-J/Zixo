package com.zixo.inventory_service.controller;

import com.zixo.inventory_service.dto.StockRequest;
import com.zixo.inventory_service.model.Inventory;
import com.zixo.inventory_service.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService service;

    @GetMapping
    public ResponseEntity<Page<Inventory>> getStocks(Pageable pageable) {
        return ResponseEntity.ok(service.getStocks(pageable));
    }

    @PostMapping("/init")
    public ResponseEntity<String> init(@RequestBody StockRequest request) {
        service.initStock(request.getProductId(),request.getQuantity());
        return ResponseEntity.ok("Stock Initialized");
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Inventory> getStock(@PathVariable Long productId) {
        Inventory inventory = service.getStock(productId);
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/reserve")
    public ResponseEntity<String> reserveStock(@Valid @RequestBody StockRequest request) {
        service.reserveStock(request.getProductId(),request.getQuantity());
        return ResponseEntity.ok("Stock Reserved");
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmStock(@RequestBody StockRequest request) {
        service.confirmStock(request.getProductId(),request.getQuantity());
        return ResponseEntity.ok("Stock Confirmed");
    }

    @PostMapping("/release")
    public ResponseEntity<String> releaseStock(@RequestBody StockRequest request) {
        service.releaseStock(request.getProductId(),request.getQuantity());
        return ResponseEntity.ok("Stock Released");
    }

    @PostMapping("/add")
    public ResponseEntity<String> addStock(@RequestBody StockRequest request) {
        service.addStock(request.getProductId(),request.getQuantity());
        return ResponseEntity.ok("Stock Added");
    }
}
