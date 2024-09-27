package com.stardustpath.stardustpath.modules.transactions.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostTransactionDto {
    private UUID userId;
    @NotNull(message = "Date must be filled")
    private LocalDateTime date;
    @NotNull(message = "Category ID must be filled")
    private UUID categoryId;
    @Min(value = 0, message = "Amount must be above 0")
    private Double amount;
    @NotBlank(message = "Note must be filled")
    private String note;
    @NotNull(message = "Is recurring must be filled")
    private Boolean isRecurring;
}
