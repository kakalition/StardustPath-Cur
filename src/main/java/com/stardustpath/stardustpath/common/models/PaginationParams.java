package com.stardustpath.stardustpath.common.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jboss.resteasy.reactive.RestQuery;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationParams {
    public UUID userId;

    @RestQuery
    public String query = "";

    @NotNull(message = "Page must be filled")
    @Min(0)
    @RestQuery
    public int page;

    @NotNull(message = "Size must be filled")
    @Min(1)
    @RestQuery
    public int size;
}
