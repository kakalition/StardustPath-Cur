package com.stardustpath.stardustpath.modules.assets.current.repositories;

import com.stardustpath.stardustpath.common.utils.QueryUtils;
import com.stardustpath.stardustpath.modules.assets.current.models.AssetTransactionPartDto;
import com.stardustpath.stardustpath.modules.assets.current.models.GetCurrentAssetDto;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CurrentAssetsRepository {
    final PgPool pg;

    public CurrentAssetsRepository(PgPool pool) {
        this.pg = pool;
    }

    public Uni<List<AssetTransactionPartDto>> findByUserId(UUID userId) {
        var query = """
            SELECT
                 t.asset_item_id AS "assetItemId",
                 CONCAT(i.name, ' (', i.symbol, ')') AS "assetItemName",
                 t.transaction_type AS "transactionType",
                 i.type AS "assetItemType",
                 t.quantity,
                 t.price
            FROM
                 asset_transactions t
                 JOIN asset_items i ON t.asset_item_id = i.id
            WHERE
                 t.user_id = $1
            ORDER BY
                 i.name ASC
            """;

        return pg.preparedQuery(query)
            .execute(Tuple.of(userId))
            .map(rows-> QueryUtils.rowSetToOutput(rows, AssetTransactionPartDto.class));
    }
//
//    public Uni<Long> countByUserId(PaginationParams params) {
//        var parameters = Parameters.with("userId", params.getUserId());
//
//        return find("WHERE userId = :userId", parameters).count();
//    }
//
//    public Uni<Long> countByUserId(UUID userId) {
//        var query = """
//            SELECT
//                 COUNT(*) AS count
//            FROM
//                 asset_transactions t
//                 JOIN asset_items i ON t.asset_item_id = i.id
//            WHERE
//                 t.user_id = $1
//            GROUP BY
//                 t.asset_item_id
//            HAVING
//                 SUM(t.quantity) > 0
//            """;
//
//        return pg.preparedQuery(query)
//            .execute(Tuple.of(userId))
//            .map(rows -> QueryUtils.rowSetToOutputScalar(rows, Long.class, "count"));
//    }
}
