package com.ssafy11.domain.accounts;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionDao {
    Integer save(Integer userId, CreateTransaction transaction);
    List<Transaction> findByDateRange(Integer userId, LocalDateTime startDate, LocalDateTime endDate);
    List<Transaction> findByTarget(Integer userId, String target);
    List<Transaction> findByAmountSign(Integer userId, boolean isPositive);
}
