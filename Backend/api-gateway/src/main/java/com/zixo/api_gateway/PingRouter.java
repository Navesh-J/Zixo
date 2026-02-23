package com.zixo.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

@Configuration
public class PingRouter {

    private final WebClient webClient = WebClient.builder().build();

    @Bean
    public RouterFunction<ServerResponse> pingRoute() {

        return route(GET("/ping"), request ->

                Mono.when(
                                webClient.get()
                                        .uri("https://auth-service-6c0q.onrender.com/ping")
                                        .retrieve()
                                        .bodyToMono(String.class),

                                webClient.get()
                                        .uri("https://product-service-y01r.onrender.com/ping")
                                        .retrieve()
                                        .bodyToMono(String.class),

                                webClient.get()
                                        .uri("https://order-service-iyqj.onrender.com/ping")
                                        .retrieve()
                                        .bodyToMono(String.class),

                                webClient.get()
                                        .uri("https://inventory-service-9zoo.onrender.com/ping")
                                        .retrieve()
                                        .bodyToMono(String.class)
                        )
                        .onErrorResume(error -> Mono.empty()) // ignore cold-start failures
                        .then(ServerResponse.ok().bodyValue("All services pinged"))
        );
    }
}