package com.stardustpath.stardustpath.modules.insights.repositories;

import com.stardustpath.stardustpath.common.utils.QueryUtils;
import com.stardustpath.stardustpath.modules.insights.models.*;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class InsightsRepository {
    final PgPool pg;

    public InsightsRepository(PgPool pg) {
        this.pg = pg;

    }

    public Uni<Double> getNetWorth(UUID userId) {
        var query = """
            SELECT
                SUM(
                    CASE
                        WHEN c.category_type = 'EXPENSE' THEN t.amount * -1
                        ELSE t.amount
                    END
                ) AS result
            FROM
                transactions AS t
                JOIN categories AS c ON t.category_id = c.id
            WHERE
                t.user_id = $1
            """;

        var queryParams = Tuple.of(
            userId.toString()
        );

        return pg.preparedQuery(query).execute(queryParams)
            .onItem()
            .transform(rows -> QueryUtils.rowSetToOutputScalar(rows, Double.class, "result"));
    }

    public Uni<List<RawTransaction>> getRawTransactions(GetInsightParams params) {
        var query = """
            SELECT
            	CONCAT_WS(' ', ca.emoji, ca.name) AS "categoryName",
            	ca.category_type AS "categoryType",
            	t.date,
            	t.amount
            FROM
            	transactions t
            	JOIN categories ca ON t.category_id = ca.id
            WHERE
            	t.user_id = $1
            	AND ca.category_type ILIKE $2
            	AND t.date BETWEEN $3
            	AND $4
            ORDER BY
            	t.date ASC
            """;

        var queryParams = Tuple.of(
            params.getUserId(),
            String.format("%%%s%%", params.getCategoryType()),
            params.getStartDate(),
            params.getEndDate()
        );

        return pg.preparedQuery(query).execute(queryParams)
            .onItem()
            .transform(rows -> QueryUtils.rowSetToOutput(rows, RawTransaction.class));
    }

    public Uni<Map<String, TransactionSumOnYearMonth>> getTransactionSumByCategoryTypeOnYearMonth(GetInsightParams params) {
        var query = """
            SELECT
                TO_CHAR(t.date, 'YYYY-MM') AS date,
                (
                    SELECT
                        SUM(
                            CASE
                                WHEN c.category_type = 'INCOME' THEN t.amount
                                ELSE 0
                            END
                        )
                ) AS income,
                (
                    SELECT
                        SUM(
                            CASE
                                WHEN c.category_type = 'EXPENSE' THEN t.amount
                                ELSE 0
                            END
                        )
                ) AS expense
            FROM
                transactions AS t
                JOIN categories AS c ON t.category_id = c.id
            WHERE
                t.user_id = $1
                AND t.date BETWEEN $2
                AND $3
            GROUP BY
                TO_CHAR(t.date, 'YYYY-MM')
            ORDER BY
                date ASC
            """;

        var queryParams = Tuple.of(
            params.getUserId(),
            params.getStartDate(),
            params.getEndDate()
        );

        return pg.preparedQuery(query).execute(queryParams)
            .onItem()
            .transform(rows -> QueryUtils.rowSetToOutput(rows, TransactionSumOnYearMonth.class))
            .onItem()
            .transformToUni(transactionSumOnYearMonths -> {
                var output = new HashMap<String, TransactionSumOnYearMonth>();

                transactionSumOnYearMonths.forEach(e -> {
                    output.put(e.getDate(), e);
                });

                return Uni.createFrom().item(output);
            });
    }

    public Uni<Map<String, WeekdayWeekendSumPair>> getTransactionSumByWeekdayWeekendOnYearMonth(
        GetInsightParams params
    ) {
        var query = """
            SELECT
                TO_CHAR(t.date, 'YYYY-MM') AS date,
                (
                    SELECT
                        SUM(
                            CASE
                                WHEN EXTRACT(
                                    ISODOW
                                    FROM
                                        t.date
                                ) NOT IN (6, 7) THEN t.amount
                                ELSE 0
                            END
                        )
                ) AS weekday,
                (
                    SELECT
                        SUM(
                            CASE
                                WHEN EXTRACT(
                                    ISODOW
                                    FROM
                                        t.date
                                ) IN (6, 7) THEN t.amount
                                ELSE 0
                            END
                        )
                ) AS weekend
            FROM
                transactions AS t
                JOIN categories AS c ON t.category_id = c.id
            WHERE
                t.user_id = $1
                AND t.date BETWEEN $2 AND $3
                AND c.category_type = 'EXPENSE'
            GROUP BY
                TO_CHAR(t.date, 'YYYY-MM')
            ORDER BY
                date ASC
            """;

        var queryParams = Tuple.of(
            params.getUserId(),
            params.getStartDate(),
            params.getEndDate()
        );

        return pg.preparedQuery(query).execute(queryParams)
            .onItem()
            .transform(rows -> QueryUtils.rowSetToOutput(rows, WeekdayWeekendSumPair.class))
            .onItem()
            .transformToUni(weekdayWeekendSumPairs -> {
                var output = new HashMap<String, WeekdayWeekendSumPair>();

                weekdayWeekendSumPairs.forEach(e -> {
                    output.put(e.getDate(), e);
                });

                return Uni.createFrom().item(output);
            });
    }

    public Uni<Map<String, RecurringVsOneTimeExpensesPair>> getTransactionSumByRecurrenceTypeStatusOnYearMonth(
        GetInsightParams params
    ) {
        var query = """
            SELECT
                TO_CHAR(t.date, 'YYYY-MM') AS date,
                (
                    SELECT
                        SUM(
                            CASE
                                WHEN t.is_recurring = true THEN t.amount
                                ELSE 0
                            END
                        )
                ) AS recurring,
                (
                    SELECT
                        SUM(
                            CASE
                                WHEN t.is_recurring = false THEN t.amount
                                ELSE 0
                            END
                        )
                ) AS "oneTime"
            FROM
                transactions AS t
                JOIN categories AS c ON t.category_id = c.id
            WHERE
                t.user_id = $1
                AND t.date BETWEEN $2 AND $3
                AND c.category_type = 'EXPENSE'
            GROUP BY
                TO_CHAR(t.date, 'YYYY-MM')
            ORDER BY
                date ASC
            """;

        var queryParams = Tuple.of(
            params.getUserId(),
            params.getStartDate(),
            params.getEndDate()
        );

        return pg.preparedQuery(query).execute(queryParams)
            .onItem()
            .transform(rows -> QueryUtils.rowSetToOutput(rows, RecurringVsOneTimeExpensesPair.class))
            .onItem()
            .transformToUni(weekdayWeekendSumPairs -> {
                var output = new HashMap<String, RecurringVsOneTimeExpensesPair>();

                weekdayWeekendSumPairs.forEach(e -> {
                    output.put(e.getDate(), e);
                });

                return Uni.createFrom().item(output);
            });
    }
}
