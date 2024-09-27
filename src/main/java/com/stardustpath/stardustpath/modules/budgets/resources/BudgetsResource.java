package com.stardustpath.stardustpath.modules.budgets.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.budgets.models.BudgetEntity;
import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetDto;
import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetParams;
import com.stardustpath.stardustpath.modules.budgets.models.PostBudgetDto;
import com.stardustpath.stardustpath.modules.budgets.services.BudgetsService;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;

import java.util.UUID;

@Path("/api/budgets")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BudgetsResource extends CommonResource {
    final BudgetsService service;

    public BudgetsResource(BudgetsService service) {
        this.service = service;
    }

    @GET
    public Uni<Pagination<GetBudgetDto>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam GetBudgetParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.get(params);
    }

    @POST
    public Uni<BudgetEntity> post(
        @RestHeader("Authorization") String authorization,
        PostBudgetDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.post(dto);
    }

    @PUT
    @Path("/{id}")
    public Uni<BudgetEntity> put(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id,
        PostBudgetDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.put(UUID.fromString(id), dto);
    }

    @DELETE
    @Path("/{id}")
    public Uni<BudgetEntity> delete(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id
    ) {
        var jwt = ensureAuthenticated(authorization);

        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
    }
}
