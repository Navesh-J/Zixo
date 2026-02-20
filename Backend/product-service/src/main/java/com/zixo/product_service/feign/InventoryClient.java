package com.zixo.product_service.feign;

import com.zixo.product_service.dto.StockRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @PostMapping("/inventory/init")
    void initStock(@RequestBody StockRequest request);

    @PostMapping("/inventory/add")
    void addStock(@RequestBody StockRequest request);

    @DeleteMapping("/inventory/{productId}")
    void deleteStock(@PathVariable Long productId);
}

