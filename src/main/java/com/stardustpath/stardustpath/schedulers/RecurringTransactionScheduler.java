package com.stardustpath.stardustpath.schedulers;

import com.stardustpath.stardustpath.modules.recurrings.models.GetRecurringDto;
import com.stardustpath.stardustpath.modules.recurrings.services.RecurringsService;
import com.stardustpath.stardustpath.modules.transactions.services.TransactionsService;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.quarkus.scheduler.Scheduled;
import io.quarkus.scheduler.ScheduledExecution;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class RecurringTransactionScheduler {
    final RecurringsService recurringsService;
    final TransactionsService transactionsService;

    public RecurringTransactionScheduler(RecurringsService recurringsService, TransactionsService transactionsService) {
        this.recurringsService = recurringsService;
        this.transactionsService = transactionsService;
    }

    @Scheduled(cron = "0 0 * * *")
    @WithTransaction
    Uni<Void> handle(ScheduledExecution execution) {
        return recurringsService.handleRecurringTransactions();
    }
}
