package com.stardustpath.stardustpath.modules.recurrings.repositories;

import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.recurrings.models.GetRecurringDto;
import com.stardustpath.stardustpath.modules.recurrings.models.RecurringEntity;
import com.stardustpath.stardustpath.modules.transactions.models.GetTransactionDto;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import org.hibernate.query.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class RecurringsRepository implements PanacheRepositoryBase<RecurringEntity, UUID> {
    public Uni<List<GetRecurringDto>> findByUserId(PaginationParams params) {
        var query = """
            SELECT r.id, r.userId, r.name, r.categoryId, CONCAT(c.emoji, ' ', c.name) AS categoryName,
                r.frequency, r.amount, r.startAt, r.nextDueAt, r.note, r.createdAt, r.updatedAt
            FROM RecurringEntity r
            JOIN CategoryEntity c ON r.categoryId = c.id
            WHERE r.userId = :userId
            ORDER BY r.nextDueAt DESC
            """;

        return Panache.withSession(() -> {
            return getSession().onItem().transformToUni(session -> {
                return session.createQuery(query, GetRecurringDto.class)
                    .setParameter("userId", params.getUserId())
                    .setPage(Page.page(params.getSize(), params.getPage()))
                    .getResultList();
            });
        });
    }

    public Uni<Long> countByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters).count();
    }

    public Uni<List<RecurringEntity>> findForToday() {
        var parameters = Parameters.with("nextDueAt", LocalDate.now());

        return find("WHERE nextDueAt = :nextDueAt", parameters).list();
    }
}
