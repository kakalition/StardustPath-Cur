package com.stardustpath.stardustpath.modules.reminders.repositories;

import com.stardustpath.stardustpath.common.models.PaginationParams;
import com.stardustpath.stardustpath.modules.reminders.models.ReminderEntity;
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
public class RemindersRepository implements PanacheRepositoryBase<ReminderEntity, UUID> {
    public Uni<List<ReminderEntity>> findByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters)
            .page(params.getPage(), params.getSize())
            .list();
    }

    public Uni<Long> countByUserId(PaginationParams params) {
        var parameters = Parameters.with("userId", params.getUserId());

        return find("WHERE userId = :userId", parameters).count();
    }

    public Uni<List<ReminderEntity>> findForToday() {
        var parameters = Parameters.with("date", LocalDate.now());

        return find("WHERE date = :date", parameters).list();
    }
}
