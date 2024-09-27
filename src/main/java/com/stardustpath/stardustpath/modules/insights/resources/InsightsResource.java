package com.stardustpath.stardustpath.modules.insights.resources;

import com.stardustpath.stardustpath.common.resources.CommonResource;
import com.stardustpath.stardustpath.modules.insights.models.*;
import com.stardustpath.stardustpath.modules.insights.services.InsightsService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestHeader;

import java.util.UUID;

@ApplicationScoped
@Path("/api/insights")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class InsightsResource extends CommonResource {
    final InsightsService service;

    public InsightsResource(InsightsService service) {
        this.service = service;
    }

    @GET
    @Path("overall-net-cashflow")
    public Uni<OverallNetCashFlowResult> getOverallNetCashFlow(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getOverallNetCashFlow(params.toGetInsightParams());
    }

    @GET
    @Path("net-worth-trends")
    public Uni<NetWorthTrendsResult> getNetWorthTrends(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getNetWorthTrends(params.toGetInsightParams());
    }

    @GET
    @Path("income-and-expense-trends")
    public Uni<IncomeAndExpenseTrendsResult> getIncomeAndExpenseTrends(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getIncomeAndExpenseTrends(params.toGetInsightParams());
    }

    @GET
    @Path("spending-by-category")
    public Uni<SpendingByCategoryResult> getSpendingByCategory(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getSpendingByCategory(params.toGetInsightParams());
    }

    @GET
    @Path("expense-ratio")
    public Uni<ExpenseRatioResult> getExpenseRatio(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getExpenseRatio(params.toGetInsightParams());
    }

    @GET
    @Path("income-vs-expense-over-time")
    public Uni<IncomeVsExpenseOverTimeResult> getIncomeVsExpenseOverTime(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getIncomeVsExpenseOverTime(params.toGetInsightParams());
    }

    @GET
    @Path("weekday-vs-weekend-spending")
    public Uni<WeekdayVsWeekendSpendingResult> getWeekdayVsWeekendSpending(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getWeekdayVsWeekendSpending(params.toGetInsightParams());
    }

    @GET
    @Path("expenses-by-day-of-the-week-and-time-of-the-day")
    public Uni<ExpenseOnYearResult> getWeekdayVsWeekendSpending(
        @RestHeader("Authorization") String authorization,
        @BeanParam ExpenseOnYearParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getExpenseOnYear(params);
    }

    @GET
    @Path("daily-spending-heat-map")
    public Uni<DailySpendingHeatMapResult> getDailySpendingHeatMap(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getDailySpendingHeatMapResult(params.toGetInsightParams());
    }

    @GET
    @Path("hourly-spending-heat-map")
    public Uni<HourlySpendingHeatMapResult> getHourlySpendingHeatMap(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getHourlySpendingHeatMapResult(params.toGetInsightParams());
    }

    @GET
    @Path("recurring-vs-one-time-expenses")
    public Uni<RecurringVsOneTimeExpensesResult> getRecurringVsOneTimeExpenses(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getRecurringVsOneTimExpenses(params.toGetInsightParams());
    }

    @GET
    @Path("savings-rate-trend")
    public Uni<SavingsRateTrendResult> getSavingsRateTrend(
        @RestHeader("Authorization") String authorization,
        @BeanParam RawGetInsightParams params
    ) {
        var jwt = ensureAuthenticated(authorization);
        params.setUserId(UUID.fromString(jwt.getSubject()));

        return service.getSavingsRateTrendResult(params.toGetInsightParams());
    }
}
