package com.stardustpath.stardustpath.modules.assets.transaction.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.models.SimpleDataOutput;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.assets.transaction.models.GetAssetTransactionDto;
import com.stardustpath.stardustpath.modules.assets.transaction.models.PostAssetTransactionDto;
import com.stardustpath.stardustpath.modules.assets.transaction.models.AssetTransactionEntity;
import com.stardustpath.stardustpath.modules.assets.transaction.services.AssetTransactionsService;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;

import java.util.List;
import java.util.UUID;

@Path("/api/assets/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AssetTransactionsResource extends CommonResource {
    final AssetTransactionsService service;

    public AssetTransactionsResource(AssetTransactionsService service) {
        this.service = service;
    }

    @GET
    public Uni<SimpleDataOutput<List<GetAssetTransactionDto>>> get(
        @RestHeader("Authorization") String authorization
    ) {
        var jwt = ensureAuthenticated(authorization);

        return service.get(UUID.fromString(jwt.getSubject()));
    }

    @POST
    public Uni<AssetTransactionEntity> post(
        @RestHeader("Authorization") String authorization,
        PostAssetTransactionDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.post(dto);
    }

    @PUT
    @Path("/{id}")
    public Uni<AssetTransactionEntity> put(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id,
        PostAssetTransactionDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.put(UUID.fromString(id), dto);
    }

    @DELETE
    @Path("/{id}")
    public Uni<AssetTransactionEntity> delete(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id
    ) {
        var jwt = ensureAuthenticated(authorization);

        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
    }
}
