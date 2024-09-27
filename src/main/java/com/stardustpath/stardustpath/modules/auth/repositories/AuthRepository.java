package com.stardustpath.stardustpath.modules.auth.repositories;

import com.stardustpath.stardustpath.modules.auth.models.User;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class AuthRepository implements PanacheRepositoryBase<User, UUID> {
    public Uni<User> findByEmail(String email) {
        return find("email", email).firstResult();
    }
}
