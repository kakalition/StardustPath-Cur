package com.stardustpath.stardustpath.modules.assets.item.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.assets.item.models.AssetItemEntity;
import com.stardustpath.stardustpath.modules.assets.item.models.GetAssetItemDto;
import com.stardustpath.stardustpath.modules.assets.item.models.PostAssetItemDto;
import com.stardustpath.stardustpath.modules.assets.item.repositories.AssetItemsRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

import java.util.UUID;

@ApplicationScoped
public class AssetItemsService {
    final AssetItemsRepository repository;

    public AssetItemsService(AssetItemsRepository repository) {
        this.repository = repository;
    }

    @WithSession
    public Uni<Pagination<GetAssetItemDto>> get(@Valid PaginationParams params) {
        return repository.findByUserId(params).chain(entities -> {
            return repository.countByUserId(params).map(aLong -> {
                return new Pagination<>(entities, aLong, params.page, params.size);
            });
        });
    }

    @WithTransaction
    public Uni<AssetItemEntity> post(@Valid PostAssetItemDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return repository.persist(entity);
    }

    @WithTransaction
    public Uni<AssetItemEntity> put(UUID id, @Valid PostAssetItemDto dto) {
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
    public Uni<AssetItemEntity> delete(UUID userId, UUID id) {
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
