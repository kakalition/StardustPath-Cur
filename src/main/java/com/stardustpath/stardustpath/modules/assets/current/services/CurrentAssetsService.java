package com.stardustpath.stardustpath.modules.assets.current.services;

import com.stardustpath.stardustpath.common.models.SimpleDataOutput;
import com.stardustpath.stardustpath.modules.assets.current.models.AssetTransactionPartDto;
import com.stardustpath.stardustpath.modules.assets.current.models.GetCurrentAssetDto;
import com.stardustpath.stardustpath.modules.assets.current.models.GetCurrentAssetResult;
import com.stardustpath.stardustpath.modules.assets.current.repositories.CurrentAssetsRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@ApplicationScoped
public class CurrentAssetsService {
    final CurrentAssetsRepository repository;

    public CurrentAssetsService(CurrentAssetsRepository repository) {
        this.repository = repository;
    }

    @WithSession
    public Uni<GetCurrentAssetResult> get(UUID userId) {
        return repository.findByUserId(userId).map(items -> {
            var data = getCurrentAssetData(items);
            var typeDistribution = new HashMap<String, Double>();
            data.stream().map(item -> item.assetItemType).distinct().forEach(s -> typeDistribution.put(s, (double) 0));

            data.forEach(asset -> {
                typeDistribution.computeIfPresent(asset.assetItemType, (key, value) -> value + asset.totalBought);
            });

            return new GetCurrentAssetResult(data, typeDistribution);
        });
    }

    //    @WithTransaction
//    public Uni<AssetTransactionEntity> post(@Valid PostAssetTransactionDto dto) {
//        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
//        entity.userId = dto.getUserId();
//
//        return repository.persist(entity);
//    }
//
//    @WithTransaction
//    public Uni<AssetTransactionEntity> put(UUID id, @Valid PostAssetTransactionDto dto) {
//        return repository.findById(id)
//            .onItem()
//            .ifNull()
//            .failWith(new NotFoundException())
//            .onItem()
//            .ifNotNull()
//            .call(existing -> {
//                if (!existing.userId.equals(dto.getUserId())) {
//                    throw new ForbiddenException();
//                }
//
//                var entity = Mapper.INSTANCE.postDtoToEntity(dto, existing);
//
//                return repository.persist(entity);
//            });
//
//    }
//
//    @WithTransaction
//    public Uni<AssetTransactionEntity> delete(UUID userId, UUID id) {
//        return repository.findById(id)
//            .onItem()
//            .ifNull()
//            .failWith(new NotFoundException())
//            .onItem()
//            .ifNotNull()
//            .call(existing -> {
//                if (!existing.userId.equals(userId)) {
//                    throw new ForbiddenException();
//                }
//
//                return repository.deleteById(id);
//            });
//    }
    private List<GetCurrentAssetDto> getCurrentAssetData(List<AssetTransactionPartDto> items) {
        var output = new HashMap<UUID, GetCurrentAssetDto>();
        var itemIds = items.stream().map(AssetTransactionPartDto::getAssetItemId).distinct();

        itemIds.forEach(id -> {
            AtomicReference<Double> quantityRef = new AtomicReference<>((double) 0);
            AtomicReference<Integer> totalQuantityBought = new AtomicReference<>(0);
            AtomicReference<Double> totalCostBought = new AtomicReference<>((double) 0);

            items.stream().filter(item -> item.getAssetItemId().equals(id)).forEach(innerItem -> {
                if (innerItem.getTransactionType().equals("BUY")) {
                    totalQuantityBought.updateAndGet(v -> v + innerItem.getQuantity());
                    totalCostBought.updateAndGet(v -> v + innerItem.getQuantity() * innerItem.getPrice());
                }

                quantityRef.updateAndGet(v -> v + innerItem.getQuantity() * (innerItem.getTransactionType().equals("BUY") ? 1 : -1));

                if (quantityRef.get() == 0) {
                    totalQuantityBought.set(0);
                    totalCostBought.set((double) 0);
                }
            });

            var target = items.stream().filter(item -> item.getAssetItemId() == id).toList().getFirst();

            output.put(
                id,
                GetCurrentAssetDto.builder()
                    .id(target.getAssetItemId())
                    .assetItemType(target.getAssetItemType())
                    .assetItemName(target.getAssetItemName())
                    .quantity(totalQuantityBought.get())
                    .averagePrice(totalQuantityBought.get() == 0 ? 0 : totalCostBought.get() / totalQuantityBought.get())
                    .totalBought(totalCostBought.get())
                    .build()
            );
        });

        return output.values().stream().sorted(Comparator.comparing(GetCurrentAssetDto::getAssetItemName)).toList();
    }
}

