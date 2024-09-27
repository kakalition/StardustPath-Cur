package com.stardustpath.stardustpath.modules.auto.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoResult {
    private UUID id;
    private String name;
    private String extra;
}
