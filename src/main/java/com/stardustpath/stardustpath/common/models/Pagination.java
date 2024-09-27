package com.stardustpath.stardustpath.common.models;

import lombok.Data;

import java.util.List;

@Data
public class Pagination<T> {
    private final List<T> data;
    private final Long count;
    private final int page;
    private final int size;
}
