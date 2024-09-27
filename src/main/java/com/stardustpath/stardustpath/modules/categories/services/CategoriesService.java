package com.stardustpath.stardustpath.modules.categories.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.categories.models.CategoryEntity;
import com.stardustpath.stardustpath.modules.categories.models.PostCategoryDto;
import com.stardustpath.stardustpath.modules.categories.repositories.CategoriesRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

import java.util.UUID;

@ApplicationScoped
public class CategoriesService {
    final CategoriesRepository repository;

    public CategoriesService(CategoriesRepository repository) {
        this.repository = repository;
    }

    @WithSession
    public Uni<Pagination<CategoryEntity>> get(@Valid PaginationParams params) {
        return repository.findByUserId(params).flatMap(entities -> {
            return repository.countByUserId(params).flatMap(aLong -> {
                return Uni.createFrom().item(
                    new Pagination<>(entities, aLong, params.page, params.size)
                );
            });
        });
    }

    @WithTransaction
    public Uni<CategoryEntity> post(@Valid PostCategoryDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return repository.persist(entity);
    }

    @WithTransaction
    public Uni<CategoryEntity> put(UUID id, @Valid PostCategoryDto dto) {
        return repository.findById(id)
            .onItem()
            .ifNull()
            .failWith(new NotFoundException())
            .onItem()
            .ifNotNull()
            .call(existing -> {
                if (!existing.userId.equals(dto.getUserId())) {
                    throw new ForbiddenException();
                }

                var entity = Mapper.INSTANCE.postDtoToEntity(dto, existing);

                return repository.persist(entity);
            });

    }

    @WithTransaction
    public Uni<CategoryEntity> delete(UUID userId, UUID id) {
        return repository.findById(id)
            .onItem()
            .ifNull()
            .failWith(new NotFoundException())
            .onItem()
            .ifNotNull()
            .call(existing -> {
                if (!existing.userId.equals(userId)) {
                    throw new ForbiddenException();
                }

                return repository.deleteById(id);
            });
    }
}
