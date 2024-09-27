package com.stardustpath.stardustpath.modules.auto.repositories;

import com.stardustpath.stardustpath.common.models.AutoCategoryParams;
import com.stardustpath.stardustpath.modules.auto.models.AutoAssetItemParams;
import com.stardustpath.stardustpath.modules.auto.models.AutoResult;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

import static io.quarkus.hibernate.reactive.panache.Panache.getSession;

@ApplicationScoped
public class AutoRepository {
    public Uni<List<AutoResult>> findCategories(AutoCategoryParams params) {
        var query = """
            SELECT e.id, CONCAT(e.emoji, ' ', e.name) AS name, e.categoryType AS extra
            FROM CategoryEntity e
            WHERE userId = :userId AND LOWER(e.categoryType) LIKE :query
            ORDER BY LOWER(e.name) ASC
            """;

        return Panache.withSession(() -> {
            return getSession().onItem().transformToUni(session -> {
                return session.createQuery(query, AutoResult.class)
                    .setParameter("userId", params.getUserId())
                    .setParameter("query", String.format("%%%s%%", (params.getType() != null ? params.getType() : "")).toLowerCase())
                    .getResultList();
            });
        });
    }

    public Uni<List<AutoResult>> findAssetItems(AutoAssetItemParams params) {
        var query = """
            SELECT e.id, CONCAT(e.name, ' (', e.symbol, ')') AS name, '' AS extra
            FROM AssetItemEntity e
            WHERE userId = :userId AND LOWER(e.type) LIKE :query
            ORDER BY e.name ASC
            """;

        return Panache.withSession(() -> {
            return getSession().onItem().transformToUni(session -> {
                return session.createQuery(query, AutoResult.class)
                    .setParameter("userId", params.getUserId())
                    .setParameter("query", String.format("%%%s%%", (params.getType() != null ? params.getType() : "")).toLowerCase())
                    .getResultList();
            });
        });
    }
}
