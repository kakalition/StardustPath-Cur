package com.stardustpath.stardustpath.modules.auto.resources;

import com.stardustpath.stardustpath.common.models.AutoCategoryParams;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.auto.models.AutoAssetItemParams;
import com.stardustpath.stardustpath.modules.auto.models.AutoResult;
import com.stardustpath.stardustpath.modules.auto.services.AutoService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
@Path("/api/auto")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class AutoResource extends CommonResource {
    final AutoService service;

    public AutoResource(AutoService service) {
        this.service = service;
    }

    @GET
    @Path("categories")
    public Uni<List<AutoResult>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam AutoCategoryParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getCategories(params);
    }

    @GET
    @Path("asset-items")
    public Uni<List<AutoResult>> getAssetItems(
        @RestHeader("Authorization") String authorization,
        @BeanParam AutoAssetItemParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getAssetItems(params);
    }

//
//    @POST
//    public Uni<RestResponse<CategoryEntity>> post(
//        @RestHeader("Authorization") String authorization,
//        PostCategoryDto dto
//    ) {
//        var jwt = ensureAuthenticated(authorization);
//        dto.setUserId(UUID.fromString(jwt.getSubject()));
//
//        return service.post(dto).map(entity -> RestResponse.status(RestResponse.Status.CREATED, entity));
//    }
//
//    @PUT
//    @Path("/{id}")
//    public Uni<CategoryEntity> put(
//        @RestHeader("Authorization") String authorization,
//        @PathParam("id") String id,
//        PostCategoryDto dto
//    ) {
//        var jwt = ensureAuthenticated(authorization);
//        dto.setUserId(UUID.fromString(jwt.getSubject()));
//
//        return service.put(UUID.fromString(id), dto);
//    }
//
//    @DELETE
//    @Path("/{id}")
//    public Uni<CategoryEntity> delete(
//        @RestHeader("Authorization") String authorization,
//        @PathParam("id") String id
//    ){
//        var jwt = ensureAuthenticated(authorization);
//
//        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
//    }
}
