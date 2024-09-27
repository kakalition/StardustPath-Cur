package com.stardustpath.stardustpath.modules.reminders.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.utils.DateUtils;
import com.stardustpath.stardustpath.modules.notifications.models.NotificationEntity;
import com.stardustpath.stardustpath.modules.notifications.repositories.NotificationsRepository;
import com.stardustpath.stardustpath.modules.reminders.models.PostReminderDto;
import com.stardustpath.stardustpath.modules.reminders.models.ReminderEntity;
import com.stardustpath.stardustpath.modules.reminders.repositories.RemindersRepository;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import com.stardustpath.stardustpath.modules.transactions.repositories.TransactionsRepository;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class RemindersService {
    final RemindersRepository remindersRepository;
    final NotificationsRepository notificationsRepository;

    public RemindersService(RemindersRepository remindersRepository, NotificationsRepository notificationsRepository) {
        this.remindersRepository = remindersRepository;
        this.notificationsRepository = notificationsRepository;
    }

    @WithSession
    public Uni<Pagination<ReminderEntity>> get(@Valid PaginationParams params) {
        return remindersRepository.findByUserId(params)
            .chain(entities -> remindersRepository.countByUserId(params).map(aLong ->
                    new Pagination<>(entities, aLong, params.page, params.size)
                )
            );
    }

    @WithTransaction
    public Uni<ReminderEntity> post(@Valid PostReminderDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return remindersRepository.persist(entity);
    }

    @WithTransaction
    public Uni<ReminderEntity> put(UUID id, @Valid PostReminderDto dto) {
        return remindersRepository.findById(id)
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

                return remindersRepository.persist(entity);
            });

    }

    @WithTransaction
    public Uni<ReminderEntity> delete(UUID userId, UUID id) {
        return remindersRepository.findById(id)
            .onItem()
            .ifNull()
            .failWith(new NotFoundException())
            .onItem()
            .ifNotNull()
            .call(existing -> {
                if (!existing.userId.equals(userId)) {
                    throw new ForbiddenException();
                }

                return remindersRepository.deleteById(id);
            });
    }

    public Uni<Void> handleReminderNotificationCreation() {
        return Panache.withTransaction(() -> remindersRepository.findForToday()
            .call(reminderEntities -> notificationsRepository.persist(reminderEntities.stream().map(entity -> NotificationEntity.builder()
                .userId(entity.userId)
                .type("REMINDER")
                .content(entity.title + ": " + entity.description + " (" + entity.prioritization + ")")
                .build()))
            )
            .call(reminderEntities -> remindersRepository.persist(
                    reminderEntities.stream().peek(
                        entity -> entity.date = DateUtils.getNextDateBasedOnRecurrence(entity.recurrence, entity.date)
                    )
                )
            )
            .replaceWithVoid());

    }
}
