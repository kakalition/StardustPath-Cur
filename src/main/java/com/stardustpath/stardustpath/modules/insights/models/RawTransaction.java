package com.stardustpath.stardustpath.modules.insights.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RawTransaction {
    private String categoryName;
    private String categoryType;
    private LocalDateTime date;
    private Double amount;
}
