package com.stardustpath.stardustpath.modules.assets.current.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetTransactionPartDto {
    private UUID assetItemId;
    private String assetItemName;
    private String transactionType;
    private String assetItemType;
    private Integer quantity;
    private Double price;
}
