package com.zixo.order_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/ping")
    public String ping() {
        return "Backend Pinged: Starting the Server....";
    }

    @GetMapping("/health")
    public String health() {
        return "Order Service is UP";
    }
}
