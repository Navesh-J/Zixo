package com.zixo.order_service.feign;

import com.zixo.order_service.dto.StockRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @PostMapping("/inventory/reserve")
    void reserveStock(@RequestBody StockRequest stockRequest);

    @PostMapping("/inventory/release")
    void releaseStock(@RequestBody StockRequest stockRequest);

    @PostMapping("/inventory/confirm")
    void confirmStock(@RequestBody StockRequest stockRequest);
}
