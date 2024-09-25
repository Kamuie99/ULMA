package com.ssafy11.api.service;

import com.ssafy11.domain.accounts.Transaction;
import com.ssafy11.domain.accounts.TransactionDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionDao transactionDao;

    @Transactional
    public Integer saveTransaction(Transaction transaction) {
        return transactionDao.save(transaction);
    }

    public List<Transaction> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionDao.findByDateRange(startDate, endDate);
    }

    public List<Transaction> findByTarget(String target) {
        return transactionDao.findByTarget(target);
    }

    public List<Transaction> findByAmountSign(boolean isPositive) {
        return transactionDao.findByAmountSign(isPositive);
    }

    @Transactional
    public Integer makeTransaction(Transaction transaction) {
        if (transaction.balance() + transaction.amount() < 0) {
            throw new IllegalArgumentException("잔액이 부족하여 거래를 처리할 수 없습니다.");
        }
        return transactionDao.makeTransaction(transaction);
    }
}
