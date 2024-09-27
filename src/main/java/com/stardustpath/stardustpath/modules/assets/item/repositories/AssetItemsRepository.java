package com.stardustpath.stardustpath.modules.assets.item.repositories;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.assets.item.models.AssetItemEntity;
import com.stardustpath.stardustpath.modules.assets.item.models.GetAssetItemDto;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AssetItemsRepository implements PanacheRepositoryBase<AssetItemEntity, UUID> {
    public Uni<List<GetAssetItemDto>> findByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId ORDER BY name ASC", parameters).page(params.getPage(), params.getSize())
            .list()
            .map(assetItemEntities -> assetItemEntities.stream().map(Mapper.INSTANCE::entityToDto).toList());
    }

    public Uni<Long> countByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters).count();
    }
}
