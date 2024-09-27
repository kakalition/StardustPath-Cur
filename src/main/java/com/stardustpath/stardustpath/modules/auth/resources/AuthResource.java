package com.stardustpath.stardustpath.modules.auth.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stardustpath.stardustpath.common.models.MessageResponse;
import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.auth.models.LoginDto;
import com.stardustpath.stardustpath.modules.auth.models.LoginResponseDto;
import com.stardustpath.stardustpath.modules.auth.models.RegisterDto;
import com.stardustpath.stardustpath.modules.auth.models.User;
import com.stardustpath.stardustpath.modules.auth.services.AuthService;
import io.quarkus.security.Authenticated;
import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import org.jboss.resteasy.reactive.RestHeader;
import org.jboss.resteasy.reactive.RestResponse;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/auth")
@PermitAll
public class AuthResource extends CommonResource {
    final AuthService service;

    public AuthResource(AuthService service) {
        this.service = service;
    }

    @GET
    @Path("identity")
    public Uni<String> identity(@RestHeader("Authorization") String authorization) throws JsonProcessingException {
        var identity = ensureAuthenticated(authorization);

        return Uni.createFrom().item(mapper.writeValueAsString(identity));
    }

    @POST
    @Path("login")
    public Uni<RestResponse<LoginResponseDto>> login(LoginDto dto) {
        return service.login(dto).map(result -> {
                var cookie = new NewCookie.Builder("Authorization")
                    .path("/")
//                    .sameSite(NewCookie.SameSite.STRICT)
                    .httpOnly(true)
                    .maxAge(60 * 60 * 24 * 30)
                    .value("Bearer " + result.getToken())
                    .build();

                return RestResponse.ResponseBuilder
                    .ok(result)
                    .cookie(cookie)
                    .build();
            }
        );
    }

    @POST
    @Path("register")
    public Uni<User> register(RegisterDto dto) {
        return service.register(dto);
    }

    @POST
    @Path("logout")
    public Uni<RestResponse<String>> logout() {
        var cookie = new NewCookie.Builder("Authorization")
            .path("/")
//            .sameSite(NewCookie.SameSite.STRICT)
            .httpOnly(true)
            .maxAge(0)
            .value("-")
            .build();

        return Uni.createFrom().item(RestResponse.ResponseBuilder
            .ok("")
            .cookie(cookie)
            .build()
        );
    }
}
