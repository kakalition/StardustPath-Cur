package com.stardustpath.stardustpath.modules.assets.transaction.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAssetTransactionDto {
    public UUID id;
    public LocalDate date;
    public String transactionType;
    public UUID assetItemId;
    public String assetItemName;
    public String assetItemType;
    public double quantity;
    public double price;
    public String note;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
