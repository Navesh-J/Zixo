package com.zixo.api_gateway.security;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    private static final List<String> OPEN_URLS = List.of(

            "/auth-service/auth/login", "/auth-service/auth/register", "/product-service/products");

    public Predicate<ServerHttpRequest> isSecured = request -> OPEN_URLS.stream()
            .noneMatch(url -> request.getURI()
                    .getPath()
                    .startsWith(url));
}

