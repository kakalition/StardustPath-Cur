package com.stardustpath.stardustpath.modules.transactions.repositories;

import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.common.utils.QueryUtils;
import com.stardustpath.stardustpath.modules.transactions.models.GetTransactionDto;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.logging.Log;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import org.hibernate.query.Page;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class TransactionsRepository implements PanacheRepositoryBase<TransactionEntity, UUID> {
    final PgPool pg;

    public TransactionsRepository(PgPool pg) {
        this.pg = pg;
    }

    public Uni<List<GetTransactionDto>> findByUserId(PaginationParams params) {
        var query = """
            SELECT t.id, t.userId, t.date, t.categoryId, CONCAT(c.emoji, ' ', c.name) AS categoryName,
                c.categoryType, t.amount, t.note, t.isRecurring, t.createdAt, t.updatedAt
            FROM TransactionEntity t
            JOIN CategoryEntity c ON t.categoryId = c.id
            WHERE t.userId = :userId AND (t.note ILIKE :query OR c.name ILIKE :query)
            ORDER BY t.date DESC
            """;

        return Panache.withSession(() -> {
            return getSession().onItem().transformToUni(session -> {
                return session.createQuery(query, GetTransactionDto.class)
                    .setParameter("userId", params.getUserId())
                    .setParameter("query", "%" + params.getQuery() + "%")
                    .setPage(Page.page(params.getSize(), params.getPage()))
                    .getResultList();
            });
        });
    }

    public Uni<Long> countByUserId(PaginationParams params) {
        var query = """
            SELECT COUNT(*)
            FROM TransactionEntity t
            JOIN CategoryEntity c ON t.categoryId = c.id
            WHERE t.userId = :userId AND (t.note ILIKE :query OR c.name ILIKE :query)
            """;

        return Panache.withSession(() -> {
            return getSession().onItem().transformToUni(session -> {
                return session.createQuery(query, Long.class)
                    .setParameter("userId", params.getUserId())
                    .setParameter("query", "%" + params.getQuery() + "%")
                    .getSingleResult();
            });
        });
    }
}
