package com.stardustpath.stardustpath.modules.auth.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDto {
    @NotBlank
    private final String email;

    @NotBlank
    private final String password;
}
