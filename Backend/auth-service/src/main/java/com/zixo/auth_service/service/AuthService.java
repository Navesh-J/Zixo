package com.zixo.auth_service.service;

import com.zixo.auth_service.exception.InvalidCredentialsException;
import com.zixo.auth_service.exception.UserAlreadyExistsException;
import com.zixo.auth_service.model.Role;
import com.zixo.auth_service.model.User;
import com.zixo.auth_service.repo.UserRepo;
import com.zixo.auth_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(String username, String password) {

        if (userRepo.existsByUsername(username)) {
            throw new UserAlreadyExistsException("User already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.USER);

        userRepo.save(user);
    }


    public String login(String username, String password) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        return jwtService.generateToken(user.getUsername());
    }
}
