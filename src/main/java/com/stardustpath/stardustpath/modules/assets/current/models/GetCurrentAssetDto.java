package com.stardustpath.stardustpath.modules.assets.current.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetCurrentAssetDto {
    public UUID id;
    public String assetItemName;
    public String assetItemType;
    public Integer quantity;
    public Double averagePrice;
    public Double totalBought;
}
