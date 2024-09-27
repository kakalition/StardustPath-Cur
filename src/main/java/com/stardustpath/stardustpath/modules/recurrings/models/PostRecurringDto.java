package com.stardustpath.stardustpath.modules.recurrings.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostRecurringDto {
    private UUID userId;

    @NotBlank(message = "Name must be filled")
    private String name;

    @NotNull(message = "Category ID must be filled")
    private UUID categoryId;

    @NotBlank(message = "Frequency must be filled")
    private String frequency;

    @NotNull(message = "Amount must be filled")
    private Double amount;

    @NotNull(message = "Start at must be filled")
    private LocalDate startAt;

    @NotNull(message = "Next due at must be filled")
    private LocalDate nextDueAt;

    private String note;
}
