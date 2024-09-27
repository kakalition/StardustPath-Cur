package com.stardustpath.stardustpath.modules.reminders.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.reminders.models.PostReminderDto;
import com.stardustpath.stardustpath.modules.reminders.models.ReminderEntity;
import com.stardustpath.stardustpath.modules.reminders.services.RemindersService;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;

import java.util.UUID;

@Path("/api/reminders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RemindersResource extends CommonResource {
    final RemindersService service;

    public RemindersResource(RemindersService service) {
        this.service = service;
    }

    @GET
    public Uni<Pagination<ReminderEntity>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam PaginationParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.get(params);
    }

    @POST
    public Uni<ReminderEntity> post(
        @RestHeader("Authorization") String authorization,
        PostReminderDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.post(dto);
    }

    @PUT
    @Path("/{id}")
    public Uni<ReminderEntity> put(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id,
        PostReminderDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.put(UUID.fromString(id), dto);
    }

    @DELETE
    @Path("/{id}")
    public Uni<ReminderEntity> delete(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id
    ) {
        var jwt = ensureAuthenticated(authorization);

        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
    }
//    @POST
//    @Path("/recurring")
//    public Uni<Void> handleRecurring(
//    ) {
//        return service.handleRecurringTransactions();
//    }
}
