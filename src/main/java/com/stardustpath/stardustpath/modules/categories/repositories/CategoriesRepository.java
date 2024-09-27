package com.stardustpath.stardustpath.modules.categories.repositories;

import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.categories.models.CategoryEntity;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CategoriesRepository implements PanacheRepositoryBase<CategoryEntity, UUID> {
    public Uni<List<CategoryEntity>> findByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId ORDER BY LOWER(name) ASC", parameters).page(params.getPage(), params.getSize()).list();
    }

    public Uni<Long> countByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters).count();
    }
}
