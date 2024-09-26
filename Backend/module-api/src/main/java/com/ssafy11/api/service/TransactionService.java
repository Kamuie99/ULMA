package com.ssafy11.api.service;

import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.accounts.CreateTransaction;
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
    public Integer saveTransaction(Integer userId, CreateTransaction transaction) {
        return transactionDao.save(userId, transaction);
    }

    public List<Transaction> findByDateRange(Integer userId, LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate.isAfter(endDate)) {
            throw new ErrorException(ErrorCode.InvalidDateRangeException);
        }
        return transactionDao.findByDateRange(userId, startDate, endDate);
    }

    public List<Transaction> findByTarget(Integer userId, String target) {
        return transactionDao.findByTarget(userId, target);
    }

    public List<Transaction> findByAmountSign(Integer userId, boolean isPositive) {
        return transactionDao.findByAmountSign(userId, isPositive);
    }

    @Transactional
    public Integer makeTransaction(Integer userId, CreateTransaction transaction) {
        if (transaction.balance() + transaction.amount() < 0) {
            throw new ErrorException(ErrorCode.NotEnoughFundsException);
        }
        return transactionDao.save(userId, transaction);
    }
}
