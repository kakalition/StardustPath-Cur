package com.stardustpath.stardustpath.modules.auto.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jboss.resteasy.reactive.RestQuery;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoAssetItemParams {
    private UUID userId;

    @RestQuery
    private String type = "";

    @RestQuery
    private String query = "";
}
