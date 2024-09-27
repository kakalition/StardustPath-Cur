package com.stardustpath.stardustpath.modules.transactions.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetTransactionDto {
    private UUID id;
    private UUID userId;
    private LocalDateTime date;
    private UUID categoryId;
    private String categoryName;
    private String categoryType;
    private Double amount;
    private String note;
    private Boolean isRecurring;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
