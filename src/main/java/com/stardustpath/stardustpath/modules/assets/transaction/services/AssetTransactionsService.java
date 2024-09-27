package com.stardustpath.stardustpath.modules.assets.transaction.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.SimpleDataOutput;
import com.stardustpath.stardustpath.modules.assets.transaction.models.GetAssetTransactionDto;
import com.stardustpath.stardustpath.modules.assets.transaction.models.PostAssetTransactionDto;
import com.stardustpath.stardustpath.modules.assets.transaction.models.AssetTransactionEntity;
import com.stardustpath.stardustpath.modules.assets.transaction.repositories.AssetTransactionsRepository;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import com.stardustpath.stardustpath.modules.transactions.repositories.TransactionsRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AssetTransactionsService {
    final AssetTransactionsRepository assetTransactionsRepository;
    final TransactionsRepository transactionsRepository;

    public AssetTransactionsService(
        AssetTransactionsRepository assetTransactionsRepository,
        TransactionsRepository transactionsRepository
    ) {
        this.assetTransactionsRepository = assetTransactionsRepository;
        this.transactionsRepository = transactionsRepository;
    }

    @WithSession
    public Uni<SimpleDataOutput<List<GetAssetTransactionDto>>> get(UUID userId) {
        return assetTransactionsRepository.findByUserId(userId).map(SimpleDataOutput::new);
    }

    @WithTransaction
    public Uni<AssetTransactionEntity> post(@Valid PostAssetTransactionDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return assetTransactionsRepository.persist(entity).call(assetTransactionEntity -> {
            return handleIncomeExpense(assetTransactionEntity.id, dto);
        });
    }

    @WithTransaction
    public Uni<AssetTransactionEntity> put(UUID id, @Valid PostAssetTransactionDto dto) {
        return assetTransactionsRepository.findById(id)
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

                return assetTransactionsRepository.persist(entity);
            });

    }

    @WithTransaction
    public Uni<AssetTransactionEntity> delete(UUID userId, UUID id) {
        return assetTransactionsRepository.findById(id)
            .onItem()
            .ifNull()
            .failWith(new NotFoundException())
            .onItem()
            .ifNotNull()
            .call(existing -> {
                if (!existing.userId.equals(userId)) {
                    throw new ForbiddenException();
                }

                return assetTransactionsRepository.deleteById(id);
            });
    }

    private Uni<TransactionEntity> handleIncomeExpense(UUID assetTransactionId, PostAssetTransactionDto dto) {
        if (dto.getTransactionType().equals("BUY")) {
            return null;
        }

        var profitLossValue = ((dto.getPrice() - dto.getAverageBuyPrice()) * dto.getQuantity()) - dto.getSellingFee();

        var transactionEntity = TransactionEntity.builder()
            .refId(assetTransactionId)
            .amount(Math.abs(profitLossValue))
            .userId(dto.getUserId())
            .note("Selling Asset")
            .date(dto.getDate().atStartOfDay());

        if (profitLossValue < 0) {
            transactionEntity = transactionEntity.categoryId(UUID.fromString("d22298f9-2d46-43c8-a95a-6744acfcd7fd"));
        } else {
            transactionEntity = transactionEntity.categoryId(UUID.fromString("b2d0fa5b-29f7-4152-b81c-0f95bb7aad9e"));
        }

        return transactionsRepository.persist(transactionEntity.build());
    }
}
