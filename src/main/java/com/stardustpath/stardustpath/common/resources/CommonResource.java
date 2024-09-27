package com.stardustpath.stardustpath.common.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stardustpath.stardustpath.common.exceptions.EmailAlreadyUsedException;
import com.stardustpath.stardustpath.common.exceptions.PasswordMismatchedException;
import com.stardustpath.stardustpath.common.exceptions.UserNotFoundException;
import io.quarkus.security.UnauthorizedException;
import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.jwt.auth.principal.ParseException;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.jboss.resteasy.reactive.server.ServerRequestFilter;
import org.jboss.resteasy.reactive.server.ServerResponseFilter;

import java.util.List;
import java.util.Optional;

public class CommonResource {
    @Inject
    JWTParser parser;

    public final ObjectMapper mapper = new ObjectMapper();

    public Optional<JsonWebToken> getJWT(String authorization) {
        if (authorization == null) {
            return Optional.empty();
        }

        var rawHeaderToken = authorization.split(" ");
        if (rawHeaderToken.length != 2) {
            return Optional.empty();
        }

        try {
            return Optional.of(parser.parse(rawHeaderToken[1]));
        } catch (ParseException e) {
            return Optional.empty();
        }
    }

    public JsonWebToken ensureAuthenticated(String authorization) {
        var auth = getJWT(authorization);
        if (auth.isEmpty()) {
            throw new UnauthorizedException();
        }

        return auth.get();
    }

    @ServerRequestFilter
    public void authFilter(ContainerRequestContext context) {
        var authorization = context.getCookies().get("Authorization");
        if (authorization == null) {
            return;
        }

        context.getHeaders().add("Authorization", authorization.getValue());
    }

    @ServerExceptionMapper
    public RestResponse<List<String>> mapException(ConstraintViolationException x) {
        var exCol = x.getConstraintViolations().stream()
            .map(cv -> cv.getPropertyPath().toString().split("\\.")[2] + ": " + cv.getMessage())
            .toList();

        return RestResponse.status(Response.Status.BAD_REQUEST, exCol);
    }

    @ServerExceptionMapper
    public RestResponse<String> mapException(EmailAlreadyUsedException x) {
        return RestResponse.status(Response.Status.CONFLICT, "Email already used.");
    }

    @ServerExceptionMapper
    public RestResponse<String> mapException(UserNotFoundException x) {
        return RestResponse.status(Response.Status.NOT_FOUND, "User not found.");
    }

    @ServerExceptionMapper
    public RestResponse<String> mapException(PasswordMismatchedException x) {
        return RestResponse.status(Response.Status.NOT_FOUND, "Password is wrong.");
    }

    @ServerExceptionMapper
    public RestResponse<String> mapException(ForbiddenException x) {
        return RestResponse.status(Response.Status.FORBIDDEN, "Forbidden.");
    }
}
