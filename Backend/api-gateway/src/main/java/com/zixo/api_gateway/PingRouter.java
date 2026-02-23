package com.zixo.api_gateway;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

@Configuration
@RequiredArgsConstructor
public class PingRouter {

    private final WebClient.Builder webClientBuilder;

    @Bean
    public RouterFunction<ServerResponse> pingRoute() {

        return route(GET("/ping"), request ->

                Mono.when(
                                webClientBuilder.build()
                                        .get()
                                        .uri("http://auth-service/ping")
                                        .retrieve()
                                        .bodyToMono(String.class),

                                webClientBuilder.build()
                                        .get()
                                        .uri("http://product-service/ping")
                                        .retrieve()
                                        .bodyToMono(String.class),

                                webClientBuilder.build()
                                        .get()
                                        .uri("http://order-service/ping")
                                        .retrieve()
                                        .bodyToMono(String.class),

                                webClientBuilder.build()
                                        .get()
                                        .uri("http://inventory-service/ping")
                                        .retrieve()
                                        .bodyToMono(String.class)
                        )
                        .onErrorResume(error -> Mono.empty()) // ignore failures
                        .then(ServerResponse.ok().bodyValue("All services pinged"))
        );
    }
}