package com.stardustpath.stardustpath.modules.budgets.models;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostBudgetDto {
    private UUID userId;
    @NotNull(message = "Category ID must be filled")
    private UUID categoryId;
    @NotNull(message = "Amount must be filled")
    private Double amount;
    @NotNull(message = "Year must be filled")
    private Integer year;
    @NotNull(message = "Month must be filled")
    private Integer month;
}
