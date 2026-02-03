package com.zixo.api_gateway.security;

import org.springframework.http.HttpMethod;
import org.springframework.http.server.PathContainer;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    private final PathPatternParser parser = new PathPatternParser();

    /*
     * Public endpoints (no JWT)
     */
    private final List<RouteRule> openEndpoints = List.of(

            // Auth
            new RouteRule(HttpMethod.POST, parser.parse("/auth-service/auth/login")),

            new RouteRule(HttpMethod.POST, parser.parse("/auth-service/auth/register")),

            // Products (public read)
            new RouteRule(HttpMethod.GET, parser.parse("/product-service/products/**")));

    /*
     * true = secured
     */
    public final Predicate<ServerHttpRequest> isSecured = request -> openEndpoints.stream()
            .noneMatch(rule -> rule.matches(request));


    private record RouteRule(HttpMethod method, PathPattern pattern) {

        boolean matches(ServerHttpRequest request) {

            if (method != null && request.getMethod() != method) {
                return false;
            }

            PathContainer path = PathContainer.parsePath(request.getURI()
                    .getPath());

            return pattern.matches(path);
        }
    }
}
