package com.stardustpath.stardustpath.modules.budgets.models;

import com.stardustpath.stardustpath.common.models.PaginationParams;
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
public class GetBudgetParams {
    private UUID userId;
    @RestQuery
    @NotNull(message = "Page must be filled")
    public int page;
    @RestQuery
    @NotNull(message = "Size must be filled")
    public int size;
    @RestQuery
    @NotNull(message = "Year must be filled")
    private int year;
    @RestQuery
    @NotNull(message = "Month must be filled")
    private int month;
}
