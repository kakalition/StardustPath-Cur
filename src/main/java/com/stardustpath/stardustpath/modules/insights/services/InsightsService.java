package com.stardustpath.stardustpath.modules.insights.services;

import com.stardustpath.stardustpath.common.utils.DateUtils;
import com.stardustpath.stardustpath.modules.insights.models.*;
import com.stardustpath.stardustpath.modules.insights.repositories.InsightsRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

@ApplicationScoped
public class InsightsService {
    final InsightsRepository repository;

    public InsightsService(InsightsRepository repository) {
        this.repository = repository;
    }

    public Uni<OverallNetCashFlowResult> getOverallNetCashFlow(GetInsightParams params) {
        return repository.getRawTransactions(params).map(rawTransactions -> {
            return OverallNetCashFlowResult.builder()
                .keyData(getKeyData(rawTransactions))
                .categories(getCategorySums(rawTransactions))
                .txMap(getSumPerDay(params.getStartDate(), params.getEndDate(), rawTransactions))
                .build();
        });
    }

    public Uni<NetWorthTrendsResult> getNetWorthTrends(GetInsightParams params) {
        return repository.getRawTransactions(params).chain(rawTransactions -> {
            var output = NetWorthTrendsResult.builder()
                .keyData(getKeyData(rawTransactions))
                .categories(getCategorySums(rawTransactions))
                .txMap(getSumPerDay(params.getStartDate(), params.getEndDate(), rawTransactions))
                .build();

            return Uni.createFrom().item(output);
        });
    }

    public Uni<IncomeAndExpenseTrendsResult> getIncomeAndExpenseTrends(GetInsightParams params) {
        return repository.getRawTransactions(params).map(rawTransactions -> {
            return IncomeAndExpenseTrendsResult.builder()
                .keyData(getKeyData(rawTransactions))
                .categories(getCategorySums(rawTransactions))
                .netCashFlowMap(getSumPerDay(params.getStartDate(), params.getEndDate(), rawTransactions))
                .expenseCashFlowMap(getSumPerDay(
                        params.getStartDate(),
                        params.getEndDate(),
                        rawTransactions.stream().filter(
                            rawTransaction -> rawTransaction.getCategoryType().equals("EXPENSE")
                        ).toList(),
                        false
                    )
                )
                .incomeCashFlowMap(getSumPerDay(
                        params.getStartDate(),
                        params.getEndDate(),
                        rawTransactions.stream().filter(
                            rawTransaction -> rawTransaction.getCategoryType().equals("INCOME")
                        ).toList(),
                        false
                    )
                )
                .build();
        });
    }

    public Uni<SpendingByCategoryResult> getSpendingByCategory(GetInsightParams params) {
        params.setCategoryType("EXPENSE");

        return repository.getRawTransactions(params).map(rawTransactions -> {
            var transactionMap = new HashMap<String, Map<String, Double>>();
            rawTransactions.stream().map(RawTransaction::getCategoryName).distinct().forEach(categoryName -> {
                var temp = getSumPerDay(
                    params.getStartDate(),
                    params.getEndDate(),
                    rawTransactions.stream()
                        .filter(rawTransaction -> rawTransaction.getCategoryName().equals(categoryName))
                        .toList(),
                    false
                );

                transactionMap.put(categoryName, temp);
            });

            return SpendingByCategoryResult.builder()
                .transactionMap(transactionMap)
                .keyData(getKeyData(rawTransactions))
                .categories(getCategorySums(rawTransactions))
                .build();
        });
    }

    public Uni<ExpenseRatioResult> getExpenseRatio(GetInsightParams params) {
        params.applyDateFilter();

        return repository.getRawTransactions(params).chain(rawTransactions -> {
            return repository.getTransactionSumByCategoryTypeOnYearMonth(params).map(transactionSumOnYearMonths -> {
                var expenseRatio = new HashMap<String, Double>();
                getDateList(params.getStartDate().toLocalDate(), params.getEndDate().toLocalDate()).stream()
                    .map(DateUtils::formatToYearMonth)
                    .distinct()
                    .forEach(date -> {
                        var temp = transactionSumOnYearMonths.get(date);

                        if (temp != null) {
                            var income = temp.getIncome() != 0 ? temp.getIncome() : 1;
                            expenseRatio.put(date, temp.getExpense() / income);
                            return;
                        }

                        expenseRatio.put(date, (double) 0);
                    });

                return ExpenseRatioResult.builder()
                    .keyData(getKeyData(rawTransactions))
                    .categories(getCategorySums(rawTransactions))
                    .expenseRatios(expenseRatio)
                    .startDate(params.getStartDate().toLocalDate())
                    .endDate(params.getEndDate().toLocalDate())
                    .build();
            });
        });
    }

    public Uni<IncomeVsExpenseOverTimeResult> getIncomeVsExpenseOverTime(GetInsightParams params) {
        params.applyDateFilter();

        return repository.getRawTransactions(params).chain(rawTransactions -> {
            return repository.getTransactionSumByCategoryTypeOnYearMonth(params).map(transactionSumOnYearMonths -> {
                var data = new HashMap<String, IncomeExpensePair>();
                getDateList(params.getStartDate().toLocalDate(), params.getEndDate().toLocalDate()).stream()
                    .map(DateUtils::formatToYearMonth)
                    .distinct()
                    .forEach(date -> {
                        var temp = transactionSumOnYearMonths.get(date);

                        if (temp != null) {
                            data.put(date, new IncomeExpensePair(temp.getIncome(), temp.getExpense()));
                            return;
                        }

                        data.put(date, new IncomeExpensePair((double) 0, (double) 0));
                    });
//
                return IncomeVsExpenseOverTimeResult.builder()
                    .keyData(getKeyData(rawTransactions))
                    .data(data)
                    .categories(getCategorySums(rawTransactions))
                    .startDate(params.getStartDate().toLocalDate())
                    .endDate(params.getEndDate().toLocalDate())
                    .build();
            });
        });
    }

    public Uni<WeekdayVsWeekendSpendingResult> getWeekdayVsWeekendSpending(GetInsightParams params) {
        params.applyDateFilter();

        return repository.getRawTransactions(params).chain(rawTransactions -> {
            return repository.getTransactionSumByWeekdayWeekendOnYearMonth(params).map(weekdayWeekendSumPairMap -> {
                var data = new HashMap<String, WeekdayWeekendSumPair>();
                getDateList(params.getStartDate().toLocalDate(), params.getEndDate().toLocalDate()).stream()
                    .map(DateUtils::formatToYearMonth)
                    .distinct()
                    .forEach(date -> {
                        var temp = weekdayWeekendSumPairMap.get(date);

                        if (temp != null) {
                            data.put(date, new WeekdayWeekendSumPair(date, temp.getWeekday(), temp.getWeekend()));
                            return;
                        }

                        data.put(date, new WeekdayWeekendSumPair(date, (double) 0, (double) 0));
                    });
//
                return WeekdayVsWeekendSpendingResult.builder()
                    .keyData(getKeyData(rawTransactions))
                    .data(data)
                    .categories(getCategorySums(rawTransactions))
                    .startDate(params.getStartDate().toLocalDate())
                    .endDate(params.getEndDate().toLocalDate())
                    .build();
            });
        });
    }

    public Uni<ExpenseOnYearResult> getExpenseOnYear(ExpenseOnYearParams params) {
        var insightParams = GetInsightParams.builder()
            .userId(params.getUserId())
            .categoryType("EXPENSE")
            .dateFilter("")
            .startDate(DateUtils.getLocalDateTimeAtStartOfYear(params.getYear()))
            .endDate(DateUtils.getLocalDateTimeAtEndOfYear(params.getYear()))
            .build();

        return repository.getRawTransactions(insightParams).map(rawTransactions -> {
            return ExpenseOnYearResult.builder()
                .txMap(getSumPerDay(insightParams.getStartDate(), insightParams.getEndDate(), rawTransactions, false))
                .build();
        });
    }

    public Uni<DailySpendingHeatMapResult> getDailySpendingHeatMapResult(GetInsightParams params) {
        return repository.getRawTransactions(params).chain(rawTransactions -> {
            return repository.getTransactionSumByWeekdayWeekendOnYearMonth(params).map(weekdayWeekendSumPairMap -> {
                var data = new HashMap<Integer, Double>();
                IntStream.rangeClosed(1, 7).forEach(i -> data.put(i, 0.0));

                rawTransactions.forEach(rawTransaction -> {
                    data.computeIfPresent(
                        rawTransaction.getDate().getDayOfWeek().getValue(),
                        (key, value) -> value + rawTransaction.getAmount()
                    );

                });

                return DailySpendingHeatMapResult.builder()
                    .keyData(getKeyData(rawTransactions))
                    .data(data)
                    .categories(getCategorySums(rawTransactions))
                    .startDate(params.getStartDate().toLocalDate())
                    .endDate(params.getEndDate().toLocalDate())
                    .build();
            });
        });
    }

    public Uni<HourlySpendingHeatMapResult> getHourlySpendingHeatMapResult(GetInsightParams params) {
        return repository.getRawTransactions(params).chain(rawTransactions -> {
            return repository.getTransactionSumByWeekdayWeekendOnYearMonth(params).map(weekdayWeekendSumPairMap -> {
                var data = new HashMap<Integer, Double>();
                IntStream.rangeClosed(0, 23).forEach(i -> data.put(i, 0.0));

                rawTransactions.forEach(rawTransaction -> {
                    data.computeIfPresent(
                        rawTransaction.getDate().getHour(),
                        (key, value) -> value + rawTransaction.getAmount()
                    );

                });

                return HourlySpendingHeatMapResult.builder()
                    .keyData(getKeyData(rawTransactions))
                    .data(data)
                    .categories(getCategorySums(rawTransactions))
                    .startDate(params.getStartDate().toLocalDate())
                    .endDate(params.getEndDate().toLocalDate())
                    .build();
            });
        });
    }

    public Uni<RecurringVsOneTimeExpensesResult> getRecurringVsOneTimExpenses(GetInsightParams params) {
        params.applyDateFilter();

        return repository.getRawTransactions(params).chain(rawTransactions -> {
            return repository.getTransactionSumByRecurrenceTypeStatusOnYearMonth(params).map(recurringVsOneTimeExpensesPairMap -> {
                var data = new HashMap<String, RecurringVsOneTimeExpensesPair>();
                getDateList(params.getStartDate().toLocalDate(), params.getEndDate().toLocalDate()).stream()
                    .map(DateUtils::formatToYearMonth)
                    .distinct()
                    .forEach(date -> {
                        var temp = recurringVsOneTimeExpensesPairMap.get(date);

                        if (temp != null) {
                            var recurringPair = RecurringVsOneTimeExpensesPair.builder()
                                .date(date)
                                .recurring(temp.getRecurring())
                                .oneTime(temp.getOneTime())
                                .build();

                            data.put(date, recurringPair);
                            return;
                        }

                        var recurringPair = RecurringVsOneTimeExpensesPair.builder()
                            .date(date)
                            .recurring((double) 0)
                            .oneTime((double) 0)
                            .build();

                        data.put(date, recurringPair);
                    });

                return RecurringVsOneTimeExpensesResult.builder()
                    .keyData(getKeyData(rawTransactions))
                    .data(data)
                    .categories(getCategorySums(rawTransactions))
                    .startDate(params.getStartDate().toLocalDate())
                    .endDate(params.getEndDate().toLocalDate())
                    .build();
            });
        });
    }

    public Uni<SavingsRateTrendResult> getSavingsRateTrendResult(GetInsightParams params) {
        params.applyDateFilter();

        return repository.getRawTransactions(params).chain(rawTransactions -> {
            return repository.getTransactionSumByCategoryTypeOnYearMonth(params).map(transactionSumOnYearMonthMap -> {
                var data = new HashMap<String, Double>();
                getDateList(params.getStartDate().toLocalDate(), params.getEndDate().toLocalDate()).stream()
                    .map(DateUtils::formatToYearMonth)
                    .distinct()
                    .sorted(Comparator.reverseOrder())
                    .forEach(date -> {
                        var temp = transactionSumOnYearMonthMap.get(date);

                        if (temp != null) {
                            data.put(date, (temp.getIncome() - temp.getExpense()) / temp.getIncome());
                            return;
                        }

                        data.put(date, (double) 0);
                    });

                return SavingsRateTrendResult.builder()
                    .keyData(getKeyData(rawTransactions))
                    .data(data)
                    .categories(getCategorySums(rawTransactions))
                    .startDate(params.getStartDate().toLocalDate())
                    .endDate(params.getEndDate().toLocalDate())
                    .build();
            });
        });
    }

    private Map<String, Double> getSumPerDay(LocalDateTime startDate, LocalDateTime endDate, List<RawTransaction> rawTransactions) {
        return _getSumPerDay(startDate, endDate, rawTransactions, true);
    }

    private Map<String, Double> getSumPerDay(
        LocalDateTime startDate,
        LocalDateTime endDate,
        List<RawTransaction> rawTransactions,
        boolean turnExpenseToNegative
    ) {
        return _getSumPerDay(startDate, endDate, rawTransactions, turnExpenseToNegative);
    }

    private Map<String, Double> _getSumPerDay(LocalDateTime startDate, LocalDateTime endDate, List<RawTransaction> rawTransactions, boolean turnExpenseToNegative) {
        var dates = getDateList(startDate.toLocalDate(), endDate.toLocalDate()).stream().map(DateUtils::formatToDatabaseDate);

        var txMap = new HashMap<String, Double>();
        dates.forEach(date -> {
            var sum = rawTransactions.stream()
                .filter(e -> DateUtils.formatToDatabaseDate(LocalDate.from(e.getDate())).equals(date))
                .map(e -> {
                    if (!turnExpenseToNegative) {
                        return e.getAmount();
                    }

                    return e.getAmount() * (e.getCategoryType().equals("EXPENSE") ? -1 : 1);
                })
                .reduce((double) 0, Double::sum);

            txMap.put(date, sum);
        });

        return txMap;
    }

    private List<LocalDate> getDateList(LocalDate startDate, LocalDate endDate) {
        return startDate.datesUntil(endDate.plusDays(1)).toList();
    }

    private List<CategorySum> getCategorySums(List<RawTransaction> rawTransactions) {
        var result = new HashMap<String, CategorySum>();

        rawTransactions.forEach(e -> {
            if (!result.containsKey(e.getCategoryName())) {
                result.put(e.getCategoryName(), new CategorySum(e.getCategoryName(), e.getCategoryType(), (double) 0));
            }

            result.computeIfPresent(e.getCategoryName(), (s, categorySum) -> {
                categorySum.setTotal(categorySum.getTotal() + e.getAmount());
                return categorySum;
            });
        });

        return result.values().stream().toList();
    }

    private KeyData getKeyData(List<RawTransaction> rawTransactions) {
        var keyData = new KeyData();

        var amounts = rawTransactions.stream()
            .map(rawTransaction -> {
                var factor = 1.0;
                if (rawTransaction.getCategoryType().equals("EXPENSE")) {
                    factor = -1;
                }

                return rawTransaction.getAmount() * factor;
            })
            .sorted(Double::compareTo)
            .toList();

        keyData.setTotalVol(amounts.size());
        keyData.setTotalTx(amounts.stream().reduce((double) 0, Double::sum));

        var expenseSum = Math.abs(amounts.stream().filter(e -> e < 0).reduce((double) 0, Double::sum));
        var expenseVol = amounts.stream().filter(e -> e < 0).count();
        keyData.setTotalExpense(expenseSum);
        keyData.setAvgExpenseTx(expenseSum / (expenseVol != 0 ? expenseVol : 1));

        var incomeSum = amounts.stream().filter(e -> e >= 0).reduce((double) 0, Double::sum);
        var incomeVol = amounts.stream().filter(e -> e >= 0).count();
        keyData.setTotalIncome(incomeSum);
        keyData.setAvgIncomeTx(incomeSum / (incomeVol != 0 ? incomeVol : 1));

        return keyData;
    }
}
