package com.stardustpath.stardustpath.modules.transactions.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.transactions.models.GetTransactionDto;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import com.stardustpath.stardustpath.modules.transactions.models.PostTransactionDto;
import com.stardustpath.stardustpath.modules.transactions.services.TransactionsService;
import io.quarkus.logging.Log;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.ApplicationScoped;
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

@ApplicationScoped
@Path("/api/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class TransactionsResource extends CommonResource {
    final TransactionsService service;

    public TransactionsResource(TransactionsService service) {
        this.service = service;
    }

    @GET
    public Uni<Pagination<GetTransactionDto>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam PaginationParams params
    ) {
        params.setUserId(UUID.fromString("f8ba211a-a110-45d2-a428-9b3582815b63"));

        return service.get(params).onFailure().invoke(throwable -> Log.error("Err Serving in Resource: " + throwable.getMessage()));
    }

    @POST
    public Uni<TransactionEntity> post(
        @RestHeader("Authorization") String authorization,
        PostTransactionDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.post(dto);
    }

    @PUT
    @Path("/{id}")
    public Uni<TransactionEntity> put(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id,
        PostTransactionDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.put(UUID.fromString(id), dto);
    }

    @DELETE
    @Path("/{id}")
    public Uni<TransactionEntity> delete(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id
    ) {
        var jwt = ensureAuthenticated(authorization);

        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
    }
}
