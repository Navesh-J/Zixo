package com.zixo.api_gateway;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ping")
public class PingController {

    private final WebClient.Builder webClientBuilder;

    @GetMapping
    public String wakeAll() {

        try {
            webClientBuilder.build()
                    .get()
                    .uri("http://auth-service/ping")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            webClientBuilder.build()
                    .get()
                    .uri("http://product-service/ping")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            webClientBuilder.build()
                    .get()
                    .uri("http://order-service/ping")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            webClientBuilder.build()
                    .get()
                    .uri("http://inventory-service/ping")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

        } catch (Exception ignored) {}

        return "All services pinged";
    }
}