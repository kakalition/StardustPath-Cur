package com.stardustpath.stardustpath.modules.recurrings.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.recurrings.models.GetRecurringDto;
import com.stardustpath.stardustpath.modules.recurrings.models.PostRecurringDto;
import com.stardustpath.stardustpath.modules.recurrings.models.RecurringEntity;
import com.stardustpath.stardustpath.modules.recurrings.services.RecurringsService;
import com.stardustpath.stardustpath.modules.transactions.models.GetTransactionDto;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestHeader;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import java.util.List;
import java.util.UUID;

@Path("/api/recurrings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RecurringsResource extends CommonResource {
    final RecurringsService service;

    public RecurringsResource(RecurringsService service) {
        this.service = service;
    }

    @GET
    public Uni<Pagination<GetRecurringDto>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam PaginationParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.get(params);
    }

    @POST
    public Uni<RecurringEntity> post(
        @RestHeader("Authorization") String authorization,
        PostRecurringDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.post(dto);
    }

    @PUT
    @Path("/{id}")
    public Uni<RecurringEntity> put(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id,
        PostRecurringDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.put(UUID.fromString(id), dto);
    }

    @DELETE
    @Path("/{id}")
    public Uni<RecurringEntity> delete(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id
    ) {
        var jwt = ensureAuthenticated(authorization);

        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
    }

    @POST
    @Path("/recurring")
    public Uni<Void> handleRecurring(
    ) {
        return service.handleRecurringTransactions();
    }
}
