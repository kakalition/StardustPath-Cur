package com.stardustpath.stardustpath.modules.insights.models;

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
public class NetWorthTrendsResult {
    private KeyData keyData;
    private List<CategorySum> categories;
    private Map<String, Double> txMap;
}
