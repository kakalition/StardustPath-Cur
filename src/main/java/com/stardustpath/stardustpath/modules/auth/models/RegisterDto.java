package com.stardustpath.stardustpath.modules.auth.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank
    public String email;

    @NotBlank
    public String password;
}
