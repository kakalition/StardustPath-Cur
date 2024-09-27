package com.stardustpath.stardustpath.modules.notifications.repositories;

import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.notifications.models.NotificationEntity;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class NotificationsRepository implements PanacheRepositoryBase<NotificationEntity, UUID> {
    public Uni<List<NotificationEntity>> findByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters)
            .page(params.getPage(), params.getSize())
            .list();
    }

    public Uni<Long> countByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters).count();
    }
}
