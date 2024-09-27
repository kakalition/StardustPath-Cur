package com.stardustpath.stardustpath.modules.insights.utils;

import com.stardustpath.stardustpath.common.utils.DateUtils;
import com.stardustpath.stardustpath.modules.insights.models.GetInsightParams;
import io.smallrye.mutiny.tuples.Tuple2;

import java.time.LocalDateTime;

public class InsightUtils {
    public static Tuple2<LocalDateTime, LocalDateTime> getDateRange(GetInsightParams params) {
        if (params.getDateFilter().equals("CST")) {
            return Tuple2.of(
                DateUtils.toStartOfDay(params.getStartDate()),
                DateUtils.toEndOfDay(params.getEndDate())
            );
        }

        return DateUtils.getDateRangeByDateFilterValue(params.getDateFilter());
    }
}
