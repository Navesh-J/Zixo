package com.zixo.api_gateway;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PingRouter {

    @GetMapping("/ping")
    public ResponseEntity<String> pingRoute() {
        return ResponseEntity.ok("Server Pinged");
    }
}