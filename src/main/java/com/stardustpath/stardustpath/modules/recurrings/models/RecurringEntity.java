package com.stardustpath.stardustpath.modules.recurrings.models;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="recurrings")
public class RecurringEntity extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public UUID id;

    @Column(name = "user_id")
    public UUID userId;

    public String name;

    @Column(name = "category_id")
    public UUID categoryId;

    public String frequency;

    public double amount;

    @Column(name = "start_at")
    public LocalDate startAt;

    @Column(name = "next_due_at")
    public LocalDate nextDueAt;

    public String note;

    @CreationTimestamp
    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
