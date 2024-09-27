package com.stardustpath.stardustpath.common.utils;

import io.smallrye.mutiny.tuples.Tuple2;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtils {
    private static final DateTimeFormatter yearMonthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final DateTimeFormatter databaseDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter databaseDateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static String formatToDatabaseDateTime(LocalDateTime date) {
        return databaseDateTimeFormatter.format(date);
    }

    public static String formatToDatabaseDate(LocalDate date) {
        return databaseDateFormatter.format(date);
    }

    public static String formatToYearMonth(LocalDate date) {
        return yearMonthFormatter.format(date);
    }

    public static Tuple2<LocalDateTime, LocalDateTime> getDateRangeByDateFilterValue(String filter) {
        var now = LocalDate.now();

        return switch (filter) {
            case "1D" -> Tuple2.of(
                now.atStartOfDay(),
                now.atTime(23, 59, 59)
            );
            case "1W" -> Tuple2.of(
                now.minusDays(7).atStartOfDay(),
                now.atTime(23, 59, 59)
            );
            case "1M" -> Tuple2.of(
                now.minusMonths(1).atStartOfDay(),
                now.atTime(23, 59, 59)
            );
            case "YTD" -> Tuple2.of(
                now.withMonth(1).withDayOfMonth(1).atStartOfDay(),
                now.atTime(23, 59, 59)
            );
            case "1Y" -> Tuple2.of(
                now.minusYears(1).atStartOfDay(),
                now.atTime(23, 59, 59)
            );
            case "3Y" -> Tuple2.of(
                now.minusYears(3).atStartOfDay(),
                now.atTime(23, 59, 59)
            );
            case "5Y" -> Tuple2.of(
                now.minusYears(5).atStartOfDay(),
                now.atTime(23, 59, 59)
            );
            default -> throw new RuntimeException("Unrecognized date filter");
        };
    }

    public static LocalDateTime getLocalDateTimeAtStartOfYear(int year) {
        return LocalDateTime.now().withYear(year).withMonth(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
    }

    public static LocalDateTime getLocalDateTimeAtEndOfYear(int year) {
        return LocalDateTime.now().withYear(year).withMonth(12).withDayOfMonth(31).withHour(23).withMinute(59).withSecond(59);
    }

    public static LocalDateTime toStartOfDay(LocalDateTime value) {
        return value.withHour(0).withMinute(0).withSecond(0);
    }

    public static LocalDateTime toEndOfDay(LocalDateTime value) {
        return value.withHour(23).withMinute(59).withSecond(59);
    }

    public static LocalDate getNextDateBasedOnRecurrence(String recurrence, LocalDate date) {
        return switch (recurrence) {
            case "WEEKLY" -> date.plusWeeks(1);
            case "BI_WEEKLY" -> date.plusWeeks(2);
            case "MONTHLY" -> date.plusMonths(1);
            case "HALF_YEARLY" -> date.plusMonths(6);
            case "YEARLY" -> date.plusYears(1);
            default -> throw new RuntimeException("Unknown recurrence.");
        };

    }
}
