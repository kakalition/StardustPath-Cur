package com.stardustpath.stardustpath.modules.assets.item.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.assets.item.models.AssetItemEntity;
import com.stardustpath.stardustpath.modules.assets.item.models.GetAssetItemDto;
import com.stardustpath.stardustpath.modules.assets.item.models.PostAssetItemDto;
import com.stardustpath.stardustpath.modules.assets.item.services.AssetItemsService;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;

import java.util.UUID;

@Path("/api/assets/items")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AssetItemsResource extends CommonResource {
    final AssetItemsService service;

    public AssetItemsResource(AssetItemsService service) {
        this.service = service;
    }

    @GET
    public Uni<Pagination<GetAssetItemDto>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam PaginationParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.get(params);
    }

    @POST
    public Uni<AssetItemEntity> post(
        @RestHeader("Authorization") String authorization,
        PostAssetItemDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.post(dto);
    }

    @PUT
    @Path("/{id}")
    public Uni<AssetItemEntity> put(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id,
        PostAssetItemDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.put(UUID.fromString(id), dto);
    }

    @DELETE
    @Path("/{id}")
    public Uni<AssetItemEntity> delete(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id
    ) {
        var jwt = ensureAuthenticated(authorization);

        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
    }
}
