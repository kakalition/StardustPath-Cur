package com.stardustpath.stardustpath.modules.insights.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyData {
    private Double totalTx;
    private Integer totalVol;
    private Double txHigh;
    private Double txLow;
    private Double avgIncomeTx;
    private Double avgExpenseTx;
    private Double totalExpense;
    private Double totalIncome;
    private Double medianTx;
}
