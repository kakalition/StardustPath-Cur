package com.stardustpath.stardustpath;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stardustpath.stardustpath.modules.auth.models.LoginResponseDto;
import com.stardustpath.stardustpath.modules.auth.resources.AuthResource;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.common.http.TestHTTPResource;
import org.jose4j.json.internal.json_simple.JSONObject;

import java.net.URL;
import java.util.Map;

import static io.restassured.RestAssured.given;

public class CommonTest {
    ObjectMapper objectMapper = new ObjectMapper();

    protected <T> Map<String, Object> toMap(T target) {
       return objectMapper.convertValue(target, new TypeReference<Map<String, Object>>() {});
    }

    @TestHTTPEndpoint(AuthResource.class)
    @TestHTTPResource
    URL authUrl;

    public LoginResponseDto login(String email, String password) {
        var authBody = new JSONObject(Map.of(
                "email", email,
                "password", password
        ));

        var temp = given().header("Content-Type", "application/json")
                .body(authBody.toJSONString())
                .header("Content-Type", "application/json")
                .when()
                .post(authUrl + "/login");

        return temp
                .then()
                .extract()
                .as(LoginResponseDto.class);
    }

}
