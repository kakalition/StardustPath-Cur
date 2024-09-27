package com.stardustpath.stardustpath.modules.reminders.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostReminderDto {
    private UUID userId;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String recurrence;

    @NotBlank
    private String prioritization;
}
