package com.stardustpath.stardustpath.modules.assets.transaction.models;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="asset_transactions")
public class AssetTransactionEntity extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public UUID id;

    @Column(name = "user_id")
    public UUID userId;

    public LocalDate date;

    @Column(name="transaction_type")
    public String transactionType;

    @Column(name="asset_item_id")
    public UUID assetItemId;

    public double quantity;

    public double price;

    public String note;

    @CreationTimestamp
    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
