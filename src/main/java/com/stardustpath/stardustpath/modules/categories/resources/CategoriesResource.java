package com.stardustpath.stardustpath.modules.categories.resources;

import com.stardustpath.stardustpath.common.models.Pagination;
import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.categories.models.CategoryEntity;
import com.stardustpath.stardustpath.modules.categories.models.PostCategoryDto;
import com.stardustpath.stardustpath.modules.categories.services.CategoriesService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;
import org.jboss.resteasy.reactive.RestResponse;

import java.util.UUID;

@ApplicationScoped
@Path("/api/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class CategoriesResource extends CommonResource {
    final CategoriesService service;

    public CategoriesResource(CategoriesService service) {
        this.service = service;
    }

    @GET
    public Uni<Pagination<CategoryEntity>> get(
        @RestHeader("Authorization") String authorization,
        @BeanParam PaginationParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.get(params);
    }

    @POST
    public Uni<RestResponse<CategoryEntity>> post(
        @RestHeader("Authorization") String authorization,
        PostCategoryDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.post(dto).map(entity -> RestResponse.status(RestResponse.Status.CREATED, entity));
    }

    @PUT
    @Path("/{id}")
    public Uni<CategoryEntity> put(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id,
        PostCategoryDto dto
    ) {
        var jwt = ensureAuthenticated(authorization);
        dto.setUserId(UUID.fromString(jwt.getSubject()));

        return service.put(UUID.fromString(id), dto);
    }

    @DELETE
    @Path("/{id}")
    public Uni<CategoryEntity> delete(
        @RestHeader("Authorization") String authorization,
        @PathParam("id") String id
    ){
        var jwt = ensureAuthenticated(authorization);

        return service.delete(UUID.fromString(jwt.getSubject()), UUID.fromString(id));
    }
}
