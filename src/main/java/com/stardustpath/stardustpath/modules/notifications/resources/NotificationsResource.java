package com.stardustpath.stardustpath.modules.notifications.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.notifications.models.NotificationEntity;
import com.stardustpath.stardustpath.modules.notifications.services.NotificationsService;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;

import java.util.UUID;

@Path("/api/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotificationsResource extends CommonResource {
    final NotificationsService service;

    public NotificationsResource(NotificationsService service) {
        this.service = service;
    }

    @GET
    public Uni<Pagination<NotificationEntity>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam PaginationParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.get(params);
    }
}
