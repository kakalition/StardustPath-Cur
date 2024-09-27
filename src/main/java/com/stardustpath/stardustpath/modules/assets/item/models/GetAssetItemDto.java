package com.stardustpath.stardustpath.modules.assets.item.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAssetItemDto {
    private UUID id;
    private String name;
    private String symbol;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
