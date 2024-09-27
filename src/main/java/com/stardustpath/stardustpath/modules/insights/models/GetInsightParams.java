package com.stardustpath.stardustpath.modules.insights.models;

import com.stardustpath.stardustpath.common.utils.DateUtils;
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
public class GetInsightParams {
    private UUID userId;
    private String categoryType = "";
    private String dateFilter = "CST";
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public void applyDateFilter() {
        if (dateFilter.equals("CST")) {
            setStartDate(DateUtils.toStartOfDay(startDate));
            setEndDate(DateUtils.toEndOfDay(endDate));
            return;
        }

        var dateRange = DateUtils.getDateRangeByDateFilterValue(dateFilter);
        setStartDate(dateRange.getItem1());
        setEndDate(dateRange.getItem2());
    }
}
