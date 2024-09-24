package com.ssafy11.domain.accounts;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionDao {
    Integer save(Transaction transaction);
    List<Transaction> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    List<Transaction> findByTarget(String target);
    List<Transaction> findByAmountSign(boolean isPositive);
}
