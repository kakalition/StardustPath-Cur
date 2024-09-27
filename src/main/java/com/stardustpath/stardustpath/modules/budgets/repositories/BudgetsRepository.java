package com.stardustpath.stardustpath.modules.budgets.repositories;

import com.stardustpath.stardustpath.common.utils.QueryUtils;
import com.stardustpath.stardustpath.common.utils.StringUtils;
import com.stardustpath.stardustpath.modules.budgets.models.BudgetEntity;
import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetDto;
import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetParams;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BudgetsRepository implements PanacheRepositoryBase<BudgetEntity, UUID> {
    final PgPool pg;

    public BudgetsRepository(PgPool pg) {
        this.pg = pg;
    }

    public Uni<List<GetBudgetDto>> findByUserId(GetBudgetParams params) {
        var query = """
            SELECT
            	b.id,
            	b.user_id AS "userId",
            	b.category_id AS "categoryId",
            	CONCAT_WS(' ', c.emoji, c.name) AS "categoryName",
            	b.amount,
            	COALESCE(
            		(
            			SELECT
            				SUM(t.amount)
            			FROM
            				transactions t
            			WHERE
            				t.date::VARCHAR ILIKE $1
            				AND b.category_id = t.category_id
            		),
            		0
            	) AS used,
            	b.year,
            	b.month,
            	b.created_at AS "createdAt",
            	b.updated_at AS "updatedAt"
            FROM
            	budgets AS b
            	JOIN categories AS c ON b.category_id = c.id
            WHERE
            	b.user_id = $2
            	AND b.year = $3
            	AND b.month = $4
            ORDER BY
            	c.name ASC
            LIMIT
            	$5
            OFFSET
                $6
            """;

        var queryParams = Tuple.of(
            String.format(
                "%s-%s%%",
                StringUtils.padLeft(4, '0', String.valueOf(params.getYear())),
                StringUtils.padLeft(2, '0', String.valueOf(params.getMonth()))
            ),
            params.getUserId().toString(),
            params.getYear(),
            params.getMonth(),
            params.getSize(),
            params.getPage() * params.getSize()
        );

        return pg.preparedQuery(query).execute(queryParams)
            .onItem()
            .transform(rows -> QueryUtils.rowSetToOutput(rows, GetBudgetDto.class));
    }

    public Uni<Long> countByUserId(GetBudgetParams params) {
        var query = """
            SELECT
                COUNT(*) AS count
            FROM
            	budgets AS b
            	JOIN categories AS c ON b.category_id = c.id
            WHERE
            	b.user_id = $1
            	AND b.year = $2
            	AND b.month = $3
            """;

        var queryParams = Tuple.of(
            params.getUserId().toString(),
            params.getYear(),
            params.getMonth()
        );

        return pg.preparedQuery(query).execute(queryParams)
            .onItem()
            .transform(rows -> QueryUtils.rowSetToOutputScalar(rows, Long.class, "count"));
    }
}
