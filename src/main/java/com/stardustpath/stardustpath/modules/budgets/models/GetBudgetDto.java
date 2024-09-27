package com.stardustpath.stardustpath.modules.budgets.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetBudgetDto {
    private UUID id;
    private UUID userId;
    private UUID categoryId;
    private String categoryName;
    private Double amount;
    private Double used;
    private Integer year;
    private Integer month;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
