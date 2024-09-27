package com.stardustpath.stardustpath.modules.categories.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostCategoryDto {
    public UUID userId;
    @NotBlank(message = "Emoji must be filled")
    public String emoji;
    @NotBlank(message = "Name must be filled")
    public String name;
    @NotBlank(message = "Note must be filled")
    public String note;
    @NotBlank(message = "Category type must be filled")
    public String categoryType;
}
