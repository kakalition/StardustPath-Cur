package com.stardustpath.stardustpath.modules.insights.models;

import com.stardustpath.stardustpath.common.utils.DateUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jboss.resteasy.reactive.RestQuery;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RawGetInsightParams {
    private UUID userId;
    private String categoryType = "";
    @RestQuery
    private String dateFilter = "CST";
    @RestQuery
    private LocalDate startDate;
    @RestQuery
    private LocalDate endDate;

    public GetInsightParams toGetInsightParams() {
        return GetInsightParams.builder()
            .userId(userId)
            .categoryType(categoryType)
            .dateFilter(dateFilter)
            .startDate((startDate != null ? startDate : LocalDate.now()).atStartOfDay())
            .endDate((endDate != null ? endDate : LocalDate.now()).atTime(23, 59, 59))
            .build();
    }
}
