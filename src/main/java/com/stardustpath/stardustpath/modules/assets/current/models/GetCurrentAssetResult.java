package com.stardustpath.stardustpath.modules.assets.current.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetCurrentAssetResult {
    private List<GetCurrentAssetDto> data;
    private Map<String, Double> typeDistribution;
}
