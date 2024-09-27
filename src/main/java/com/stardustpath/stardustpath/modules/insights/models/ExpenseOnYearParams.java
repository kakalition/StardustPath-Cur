package com.stardustpath.stardustpath.modules.insights.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jboss.resteasy.reactive.RestQuery;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseOnYearParams {
    private UUID userId;
    @RestQuery
    private int year;
}
