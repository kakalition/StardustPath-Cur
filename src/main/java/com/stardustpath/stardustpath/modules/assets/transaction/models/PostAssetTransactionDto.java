package com.stardustpath.stardustpath.modules.assets.transaction.models;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostAssetTransactionDto {
    private UUID userId;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String transactionType;

    @NotNull
    private UUID assetItemId;

    @NotNull
    private double quantity;

    @NotNull
    private double price;

    private String note;

    private double averageBuyPrice;
    private double sellingFee;
}
