package com.zixo.api_gateway.security;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final RouteValidator validator;
    private final JwtUtil jwtUtil;

    public JwtAuthFilter(RouteValidator validator, JwtUtil jwtUtil) {

        super(Config.class);

        this.validator = validator;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {

        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();

            if (validator.isSecured.test(request)) {

                String authHeader = request.getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

                // Validate header
                if (authHeader == null || !authHeader.matches("^Bearer\\s+.+$")) {

                    return unauthorized(exchange);
                }

                String token = authHeader.substring(7);

                // Validate JWT
                if (!jwtUtil.validateToken(token)) {

                    return unauthorized(exchange);
                }
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {

        exchange.getResponse()
                .setStatusCode(HttpStatus.UNAUTHORIZED);

        return exchange.getResponse()
                .setComplete();
    }

    public static class Config {
    }
}
