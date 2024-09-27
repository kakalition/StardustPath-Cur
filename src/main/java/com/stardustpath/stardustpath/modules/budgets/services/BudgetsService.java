package com.stardustpath.stardustpath.modules.budgets.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.budgets.models.BudgetEntity;
import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetDto;
import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetParams;
import com.stardustpath.stardustpath.modules.budgets.models.PostBudgetDto;
import com.stardustpath.stardustpath.modules.budgets.repositories.BudgetsRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BudgetsService {
    final BudgetsRepository repository;

    public BudgetsService(BudgetsRepository repository) {
        this.repository = repository;
    }

    @WithSession
    public Uni<Pagination<GetBudgetDto>> get(@Valid GetBudgetParams params) {
        return repository.findByUserId(params).flatMap(entities -> {
            return repository.countByUserId(params).flatMap(aLong -> {
                return Uni.createFrom().item(
                    new Pagination<>(entities, aLong, params.getPage(), params.getSize())
                );
            });
        });
    }

    @WithTransaction
    public Uni<BudgetEntity> post(@Valid PostBudgetDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return repository.persist(entity);
    }

    @WithTransaction
    public Uni<BudgetEntity> put(UUID id, @Valid PostBudgetDto dto) {
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
    public Uni<BudgetEntity> delete(UUID userId, UUID id) {
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
