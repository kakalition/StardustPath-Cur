package com.stardustpath.stardustpath.common.tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stardustpath.stardustpath.modules.auth.models.LoginResponseDto;
import jakarta.enterprise.context.ApplicationScoped;
import org.jose4j.json.internal.json_simple.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@ApplicationScoped
public class AuthTestHelper {
    HttpClient client = HttpClient.newHttpClient();
    ObjectMapper mapper = new ObjectMapper();

    public LoginResponseDto login(String email, String password) {
        var authBody = new JSONObject(Map.of(
                "email", email,
                "password", password
        ));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/auth/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(authBody.toJSONString()))
                .build();


        try {
            var authResponse = client.send(request, HttpResponse.BodyHandlers.ofString());
            return mapper.readValue(authResponse.body(), LoginResponseDto.class) ;
        } catch (IOException | InterruptedException e) {
            return null;
        }
    }
}
