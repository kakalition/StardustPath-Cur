package com.stardustpath.stardustpath.modules.assets.transaction.repositories;

import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.utils.QueryUtils;
import com.stardustpath.stardustpath.modules.assets.transaction.models.GetAssetTransactionDto;
import com.stardustpath.stardustpath.modules.assets.transaction.models.AssetTransactionEntity;
import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetParams;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AssetTransactionsRepository implements PanacheRepositoryBase<AssetTransactionEntity, UUID> {
    final PgPool pg;

    public AssetTransactionsRepository(PgPool pool) {
        this.pg = pool;
    }

    public Uni<List<GetAssetTransactionDto>> findByUserId(UUID userId) {
        var query = """
            SELECT
                 t.id,
                 t.date,
                 t.transaction_type AS "transactionType",
                 t.asset_item_id AS "assetItemId",
                 CONCAT(i.name, ' (', i.symbol, ')') AS "assetItemName",
                 i.type AS "assetItemType",
                 t.quantity,
                 t.price,
                 t.note,
                 t.created_at AS "createdAt",
                 t.updated_at AS "updatedAt"
            FROM
                 asset_transactions t
                 JOIN asset_items i ON t.asset_item_id = i.id
            WHERE
                 t.user_id = $1
            ORDER BY
                 t.date DESC,
                 t.updated_at DESC
            """;

        return pg.preparedQuery(query)
            .execute(Tuple.of(userId))
            .map(rows->QueryUtils.rowSetToOutput(rows, GetAssetTransactionDto.class));
    }

    public Uni<Long> countByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters).count();
    }

    public Uni<Long> countByUserId(UUID userId) {
        var query = """
            SELECT
                 COUNT(*) AS count
            FROM
                 asset_transactions t
                 JOIN asset_items i ON t.asset_item_id = i.id
            WHERE
                 t.user_id = $1
            """;

        return pg.preparedQuery(query)
            .execute(Tuple.of(userId))
            .map(rows -> QueryUtils.rowSetToOutputScalar(rows, Long.class, "count"));
    }
}
