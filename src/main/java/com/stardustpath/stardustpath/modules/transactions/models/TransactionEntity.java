package com.stardustpath.stardustpath.modules.transactions.models;

import io.quarkus.arc.All;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="transactions")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEntity extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public UUID id;

    @Column(name = "user_id")
    public UUID userId;
    public LocalDateTime date;
    @Column(name = "category_id")
    public UUID categoryId;
    public Double amount;
    public String note;
    @Column(name = "is_recurring")
    public Boolean isRecurring;

    public UUID refId;

    @CreationTimestamp
    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
