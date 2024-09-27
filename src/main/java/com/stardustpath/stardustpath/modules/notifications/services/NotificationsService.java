package com.stardustpath.stardustpath.modules.notifications.services;

import com.stardustpath.stardustpath.common.Mapper;
import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.notifications.models.NotificationEntity;
import com.stardustpath.stardustpath.modules.notifications.models.PostNotificationDto;
import com.stardustpath.stardustpath.modules.notifications.repositories.NotificationsRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

import java.util.UUID;

@ApplicationScoped
public class NotificationsService {
    final NotificationsRepository notificationsRepository;

    public NotificationsService(NotificationsRepository notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    @WithSession
    public Uni<Pagination<NotificationEntity>> get(@Valid PaginationParams params) {
        return notificationsRepository.findByUserId(params).flatMap(entities -> {
            return notificationsRepository.countByUserId(params).flatMap(aLong -> {
                return Uni.createFrom().item(
                    new Pagination<>(entities, aLong, params.page, params.size)
                );
            });
        });
    }

    @WithTransaction
    public Uni<NotificationEntity> post(@Valid PostNotificationDto dto) {
        var entity = Mapper.INSTANCE.postDtoToEntity(dto);
        entity.userId = dto.getUserId();

        return notificationsRepository.persist(entity);
    }

    @WithTransaction
    public Uni<NotificationEntity> delete(UUID userId, UUID id) {
        return notificationsRepository.findById(id)
            .onItem()
            .ifNull()
            .failWith(new NotFoundException())
            .onItem()
            .ifNotNull()
            .call(existing -> {
                if (!existing.userId.equals(userId)) {
                    throw new ForbiddenException();
                }

                return notificationsRepository.deleteById(id);
            });
    }
}
