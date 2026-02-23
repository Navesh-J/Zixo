package com.zixo.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

@Configuration
public class PingRouter {

    private WebClient buildWebClient() {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(150)); // allow 2+ min cold start

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> pingRoute() {

        WebClient webClient = buildWebClient();

        return route(GET("/ping"), request ->

                webClient.get()
                        .uri("https://auth-service-6c0q.onrender.com/ping")
                        .retrieve()
                        .bodyToMono(String.class)

                        .then(webClient.get()
                                .uri("https://product-service-y01r.onrender.com/ping")
                                .retrieve()
                                .bodyToMono(String.class))

                        .then(webClient.get()
                                .uri("https://order-service-iyqj.onrender.com/ping")
                                .retrieve()
                                .bodyToMono(String.class))

                        .then(webClient.get()
                                .uri("https://inventory-service-9zoo.onrender.com/ping")
                                .retrieve()
                                .bodyToMono(String.class))

                        .onErrorResume(error -> Mono.empty())
                        .then(ServerResponse.ok().bodyValue("All services pinged"))
        );
    }
}