package com.zixo.inventory_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CoreController {

    @GetMapping("/ping")
    public String ping() {
        return "Backend Pinged: Starting the Server....";
    }

    @GetMapping("/health")
    public String health() {
        return "Order Service is UP";
    }
}
