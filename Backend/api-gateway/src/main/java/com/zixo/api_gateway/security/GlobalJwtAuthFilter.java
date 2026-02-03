package com.zixo.api_gateway.security;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalJwtAuthFilter implements GlobalFilter {

    private final RouteValidator routeValidator;
    private final JwtUtil jwtUtil;

    // ✅ Explicit constructor (Spring will inject automatically)
    public GlobalJwtAuthFilter(RouteValidator routeValidator, JwtUtil jwtUtil) {

        this.routeValidator = routeValidator;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        var request = exchange.getRequest();

        // Public endpoint → skip auth
        if (!routeValidator.isSecured.test(request)) {
            return chain.filter(exchange);
        }

        // Get Authorization header
        String authHeader = request.getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        String token = authHeader.substring(7);

        // Validate JWT
        if (!jwtUtil.validateToken(token)) {
            return unauthorized(exchange);
        }

        return chain.filter(exchange);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {

        exchange.getResponse()
                .setStatusCode(HttpStatus.UNAUTHORIZED);

        return exchange.getResponse()
                .setComplete();
    }
}
