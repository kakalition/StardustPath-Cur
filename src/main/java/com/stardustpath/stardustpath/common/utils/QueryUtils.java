package com.stardustpath.stardustpath.common.utils;

import com.stardustpath.stardustpath.modules.budgets.models.GetBudgetDto;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.RowSet;

import java.util.ArrayList;
import java.util.List;

public class QueryUtils {
    public static <T> List<T> rowSetToOutput(RowSet<Row> rows, Class<T> target) {
        var result = new ArrayList<T>();
        for (Row row : rows) {
            result.add(row.toJson().mapTo(target));
        }

        return result;
    }

    public static <T> T rowSetToOutputScalar(RowSet<Row> rows, Class<T> target, String columnName) {
        var row = rows.iterator().next();

        return row.get(target, columnName);
    }
}
