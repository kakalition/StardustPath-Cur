package com.stardustpath.stardustpath.modules.auth.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.exceptions.EmailAlreadyUsedException;
import com.stardustpath.stardustpath.common.exceptions.PasswordMismatchedException;
import com.stardustpath.stardustpath.common.exceptions.UserNotFoundException;
import com.stardustpath.stardustpath.modules.auth.models.LoginDto;
import com.stardustpath.stardustpath.modules.auth.models.LoginResponseDto;
import com.stardustpath.stardustpath.modules.auth.models.RegisterDto;
import com.stardustpath.stardustpath.modules.auth.models.User;
import com.stardustpath.stardustpath.modules.auth.repositories.AuthRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import org.eclipse.microprofile.jwt.Claims;

import java.time.Duration;
import java.util.Collections;
import java.util.HashSet;

@ApplicationScoped
public class AuthService {
    final AuthRepository repository;

    public AuthService(AuthRepository repository) {
        this.repository = repository;
    }

    @WithTransaction
    public Uni<LoginResponseDto> login(@Valid LoginDto dto) {
        return repository.findByEmail(dto.getEmail())
                .onItem().ifNull().failWith(new UserNotFoundException())
                .onItem().ifNotNull().call(user -> {
                    if (!BcryptUtil.matches(dto.getPassword(), user.getPassword())) {
                        throw new PasswordMismatchedException();
                    }

                    return Uni.createFrom().item(user);
                })
                .onItem().transform(user -> {
                    var token = getJwtToken(user);

                    return new LoginResponseDto(token);
                });
    }

    @WithTransaction
    public Uni<User> register(@Valid RegisterDto dto) {
        return repository.findByEmail(dto.email)
            .onItem().ifNotNull().failWith(new EmailAlreadyUsedException())
            .onItem().ifNull().switchTo(() -> {
                var entity = Mapper.INSTANCE.registerDtoToUser(dto);
                entity.setPassword(BcryptUtil.bcryptHash(entity.getPassword()));
                entity.setRole("User");

                return repository.persist(entity);
            });
    }

    private String getJwtToken(User user) {
        return Jwt.issuer("https://example.com/issuer")
                .upn(user.getEmail())
                .groups(new HashSet<>(Collections.singletonList(user.getRole())))
                .claim(Claims.sub, user.getId().toString())
                .claim(Claims.email, user.getEmail())
                .expiresIn(Duration.ofDays(30))
                .sign();
    }
}
