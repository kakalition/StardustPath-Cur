package com.stardustpath.stardustpath.modules.recurrings.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetRecurringDto {
    private UUID id;
    private UUID userId;
    private String name;
    private UUID categoryId;
    private String categoryName;
    private String frequency;
    private Double amount;
    private LocalDate startAt;
    private LocalDate nextDueAt;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
