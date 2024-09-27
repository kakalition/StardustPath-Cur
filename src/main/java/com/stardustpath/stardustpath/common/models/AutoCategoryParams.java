package com.stardustpath.stardustpath.common.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jboss.resteasy.reactive.RestQuery;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoCategoryParams {
    private UUID userId;

    @RestQuery
    private String type;
}
