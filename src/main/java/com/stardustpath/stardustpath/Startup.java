package com.stardustpath.stardustpath;

import com.github.javafaker.Faker;
import com.stardustpath.stardustpath.modules.auth.models.User;
import com.stardustpath.stardustpath.modules.categories.models.CategoryEntity;
import com.stardustpath.stardustpath.modules.categories.repositories.CategoriesRepository;
import com.stardustpath.stardustpath.modules.transactions.models.TransactionEntity;
import com.stardustpath.stardustpath.modules.transactions.repositories.TransactionsRepository;
import io.quarkus.runtime.StartupEvent;
import io.quarkus.vertx.VertxContextSupport;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Singleton;
import org.hibernate.TransactionException;
import org.hibernate.reactive.mutiny.Mutiny;

import java.sql.Date;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Singleton
public class Startup {
    public void loadUsers(@Observes StartupEvent ev, Mutiny.SessionFactory sf) throws Throwable {
//        VertxContextSupport.subscribeAndAwait(() -> {
//            return sf.withTransaction(session -> User.deleteAll());
//        });
//
//        VertxContextSupport.subscribeAndAwait(() -> {
//            return sf.withTransaction(session -> User.add("kaka@mail.com", "00000000", "Admin"));
//        });
//
//        VertxContextSupport.subscribeAndAwait(() -> {
//            return sf.withTransaction(session -> User.add("demo@mail.com", "00000000", "User"));
//        });
    }

//    public void loadCategories(@Observes StartupEvent ev, Mutiny.SessionFactory sf, CategoriesRepository repository) throws Throwable {
//        var faker = new Faker();
//        var userId = UUID.fromString("f8ba211a-a110-45d2-a428-9b3582815b63");
//        var categoryTypes = Arrays.asList("EXPENSE", "INCOME");
//
//        VertxContextSupport.subscribeAndAwait(() -> {
//            return sf.withTransaction(session -> {
//                var list = new ArrayList<CategoryEntity>();
//
//                for (var i = 0; i < 20; i++) {
//                    list.add(new CategoryEntity(
//                        null,
//                        userId,
//                        faker.slackEmoji().emoji(),
//                        faker.lorem().word(),
//                        faker.lorem().sentence(),
//                        categoryTypes.get(faker.random().nextInt(categoryTypes.size())),
//                        LocalDateTime.now(),
//                        LocalDateTime.now()
//                    )) ;
//                }
//
//                return repository.persist(list);
//            });
//        });
//    }

//    public void loadTransactions(
//        @Observes StartupEvent ev,
//        Mutiny.SessionFactory sf,
//        TransactionsRepository transactionsRepository,
//        CategoriesRepository categoriesRepository
//    ) throws Throwable {
//        var faker = new Faker();
//        var userId = UUID.fromString("f8ba211a-a110-45d2-a428-9b3582815b63");
//        var formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//
//
//        VertxContextSupport.subscribeAndAwait(() -> {
//            return sf.withTransaction(session -> {
//                return categoriesRepository.findAll().list().call(entities -> {
//                    var list = new ArrayList<TransactionEntity>();
//                    var recurrings = Arrays.asList(false, true);
//
//                    for (var i = 0; i < 1000; i++) {
//                        try {
//                            list.add(new TransactionEntity(
//                                null,
//                                userId,
//                                faker.date().between(
//                                    formatter.parse("2024-01-01 00:00:00"),
//                                    formatter.parse("2024-12-31 23:59:59")
//                                ).toInstant().atZone(ZoneId.of("Asia/Jakarta")).toLocalDateTime(),
//                                entities.get(faker.random().nextInt(entities.size())).id,
//                                (double) faker.number().numberBetween(0, 10_000_000),
//                                faker.lorem().sentence(),
//                                recurrings.get(faker.random().nextInt(recurrings.size())),
//                                LocalDateTime.now(),
//                                LocalDateTime.now()
//                            ));
//                        } catch (ParseException e) {
//                            throw new RuntimeException(e);
//                        }
//                    }
//
//                    return transactionsRepository.persist(list);
//                });
//
//            });
//        });
//    }
}
