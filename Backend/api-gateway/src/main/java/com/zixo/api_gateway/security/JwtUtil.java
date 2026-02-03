package com.zixo.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey key;

    @PostConstruct
    public void init() {

        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT secret is missing");
        }

        if (secret.length() < 32) {
            throw new IllegalStateException("JWT secret must be >= 32 chars");
        }

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        log.info("JWT key initialized");
    }

    // Validate token
    public boolean validateToken(String token) {

        try {

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (ExpiredJwtException e) {

            log.warn("JWT expired");

        } catch (JwtException e) {

            log.warn("Invalid JWT: {}", e.getMessage());

        } catch (Exception e) {

            log.error("JWT validation error", e);
        }

        return false;
    }

    // Get username
    public String extractUsername(String token) {

        return extractClaims(token).getSubject();
    }

    // Get role (optional)
    public String extractRole(String token) {

        return extractClaims(token).get("role", String.class);
    }

    // Get all claims
    public Claims extractClaims(String token) {

        try {

            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

        } catch (JwtException e) {

            log.warn("Claim extraction failed: {}", e.getMessage());

            throw new SecurityException("Invalid token");
        }
    }
}
