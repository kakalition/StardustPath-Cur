package com.stardustpath.stardustpath.modules.insights.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategorySum {
    private String name;
    private String type;
    private Double total;
}
