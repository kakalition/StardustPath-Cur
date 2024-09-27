package com.stardustpath.stardustpath.modules.transactions.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.transactions.models.GetTransactionDto;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import com.stardustpath.stardustpath.modules.transactions.models.PostTransactionDto;
import com.stardustpath.stardustpath.modules.transactions.repositories.TransactionsRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.quarkus.narayana.jta.runtime.TransactionConfiguration;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class TransactionsService {
    final TransactionsRepository repository;

    public TransactionsService(TransactionsRepository repository) {
        this.repository = repository;
    }

    @WithSession
    public Uni<Pagination<GetTransactionDto>> get(@Valid PaginationParams params) {
        return repository.findByUserId(params).flatMap(entities -> {
            return repository.countByUserId(params).flatMap(aLong -> {
                return Uni.createFrom().item(
                    new Pagination<>(entities, aLong, params.page, params.size)
                );
            });
        });
    }

    @WithTransaction
    public Uni<TransactionEntity> post(@Valid PostTransactionDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return repository.persist(entity);
    }

    @WithTransaction
    public Uni<TransactionEntity> put(UUID id, @Valid PostTransactionDto dto) {
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
    public Uni<TransactionEntity> delete(UUID userId, UUID id) {
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
