package com.stardustpath.stardustpath.modules.recurrings.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.utils.DateUtils;
import com.stardustpath.stardustpath.modules.recurrings.models.GetRecurringDto;
import com.stardustpath.stardustpath.modules.recurrings.models.PostRecurringDto;
import com.stardustpath.stardustpath.modules.recurrings.models.RecurringEntity;
import com.stardustpath.stardustpath.modules.recurrings.repositories.RecurringsRepository;
import com.stardustpath.stardustpath.modules.transactions.models.GetTransactionDto;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import com.stardustpath.stardustpath.modules.transactions.repositories.TransactionsRepository;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@SuppressWarnings("ResultOfMethodCallIgnored")
@ApplicationScoped
public class RecurringsService {
    final RecurringsRepository recurringRepository;
    final TransactionsRepository transactionsRepository;

    public RecurringsService(RecurringsRepository recurringRepository, TransactionsRepository transactionsRepository) {
        this.recurringRepository = recurringRepository;
        this.transactionsRepository = transactionsRepository;
    }

    @WithSession
    public Uni<Pagination<GetRecurringDto>> get(@Valid PaginationParams params) {
        return recurringRepository.findByUserId(params).flatMap(entities -> {
            return recurringRepository.countByUserId(params).flatMap(aLong -> {
                return Uni.createFrom().item(
                    new Pagination<>(entities, aLong, params.page, params.size)
                );
            });
        });
    }

    @WithTransaction
    public Uni<RecurringEntity> post(@Valid PostRecurringDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return recurringRepository.persist(entity);
    }

    @WithTransaction
    public Uni<RecurringEntity> put(UUID id, @Valid PostRecurringDto dto) {
        return recurringRepository.findById(id)
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

                return recurringRepository.persist(entity);
            });

    }

    @WithTransaction
    public Uni<RecurringEntity> delete(UUID userId, UUID id) {
        return recurringRepository.findById(id)
            .onItem()
            .ifNull()
            .failWith(new NotFoundException())
            .onItem()
            .ifNotNull()
            .call(existing -> {
                if (!existing.userId.equals(userId)) {
                    throw new ForbiddenException();
                }

                return recurringRepository.deleteById(id);
            });
    }

    public Uni<Void> handleRecurringTransactions() {
        return Panache.withTransaction(() -> {
            return recurringRepository.findForToday()
                .call(recurringEntities -> transactionsRepository.persist(recurringEntities.stream().map(entity -> {
                    return TransactionEntity.builder()
                        .userId(entity.userId)
                        .refId(entity.id)
                        .categoryId(entity.categoryId)
                        .isRecurring(true)
                        .amount(entity.amount)
                        .date(LocalDateTime.now())
                        .note("Recurring Transaction: " + entity.name)
                        .build();
                })))
                .call(recurringEntities -> {
                    return recurringRepository.persist(recurringEntities.stream().peek(entity -> entity.nextDueAt = DateUtils.getNextDateBasedOnRecurrence(entity.frequency, entity.nextDueAt)));
                })
                .replaceWithVoid();
        });
    }
}
