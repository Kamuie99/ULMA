package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.account.ChargePayBalanceResponse;
import com.ssafy11.api.dto.pay.PayHistoryDTO;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.PaginatedHistory;
import com.ssafy11.domain.Pay.PayDao;
import com.ssafy11.domain.Pay.PayHistory;
import com.ssafy11.domain.Pay.PayType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PayServiceImpl implements PayService {

    private final PayDao payDao;

    @Override
    public AccountDTO createPayAccount(Integer userId) {
        Account payAccountByUserId = payDao.findPayAccountByUserId(userId);

        if (payAccountByUserId != null) {
            throw new ErrorException(ErrorCode.ALREADY_EXIST_PAY_ACCOUNT);
        }

        Account createdAccount = payDao.createPayAccount(userId);
        return new AccountDTO(
                createdAccount.accountNumber(),
                createdAccount.balance(),
                createdAccount.bankCode()
        );
    }

    @Override
    public PayHistoryDTO chargePayBalance(Integer userId, Long amount) {

        PayHistory receiveHistory = payDao.chargePayBalance(userId, amount);
        if (receiveHistory == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        return new PayHistoryDTO(
                receiveHistory.amount(),
                receiveHistory.balanceAfterTransaction(),
                receiveHistory.transactionType(),
                receiveHistory.counterpartyName(),
                receiveHistory.counterpartyAccountNumber(),
                receiveHistory.description(),
                receiveHistory.transactionDate()
        );
    }

    @Override
    public PayHistoryDTO sendPayMoney(Integer userId, String info, String targetAccountNumber, Long amount) {
        if (amount > 2000000) {
            throw new ErrorException(ErrorCode.LIMIT_EXCEEDED);
        }
        if (amount <= 0) {
            throw new ErrorException(ErrorCode.NEGATIVE_VALUE_NOT_ALLOWED);
        }
        PayHistory sendHistory = payDao.sendPayMoney(userId, info, targetAccountNumber, amount);
        if (sendHistory == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        return new PayHistoryDTO(
                sendHistory.amount(),
                sendHistory.balanceAfterTransaction(),
                sendHistory.transactionType(),
                sendHistory.counterpartyName(),
                sendHistory.counterpartyAccountNumber(),
                sendHistory.description(),
                sendHistory.transactionDate()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PaginatedHistory<PayHistoryDTO> viewPayHistory(Integer userId, LocalDate startDate, LocalDate endDate, String payType, Integer page, Integer size) {

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new ErrorException(ErrorCode.INVALID_DATE_RANGE);
        }

        PaginatedHistory<PayHistory> history = payDao.findPayHistory(userId, startDate, endDate, payType, page, size);

        if (history == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        List<PayHistoryDTO> payHistories = history.data().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PaginatedHistory<>(payHistories, page, history.totalItemsCount(), history.totalPages());
    }

    // PayHistory 엔티티를 PayHistoryDTO로 변환하는 메서드
    private PayHistoryDTO convertToDTO(PayHistory payHistory) {
        return new PayHistoryDTO(
                payHistory.amount(),
                payHistory.balanceAfterTransaction(),
                payHistory.transactionType(),
                payHistory.counterpartyName(),
                payHistory.counterpartyAccountNumber(),
                payHistory.description(),
                payHistory.transactionDate()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ChargePayBalanceResponse viewPayBalance(Integer userId) {
        Account payAccount = payDao.findPayAccountByUserId(userId);
        if (payAccount == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        return new ChargePayBalanceResponse(payAccount.balance());
    }
}
