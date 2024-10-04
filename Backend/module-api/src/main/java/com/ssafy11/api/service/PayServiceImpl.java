package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.account.ChargePayAmountResponse;
import com.ssafy11.api.dto.pay.PayHistoryDTO;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.PayDao;
import com.ssafy11.domain.Pay.PayHistory;
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
        PayHistory sendHistory = payDao.sendPayMoney(userId, info, targetAccountNumber, amount);
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
    public List<PayHistoryDTO> viewPayHistory(Integer userId, LocalDate startDate, LocalDate endDate, String payType) {
        List<PayHistory> history = payDao.findPayHistory(userId, startDate, endDate, payType);
        return history.stream()
                .map(h -> new PayHistoryDTO(
                        h.amount(),
                        h.balanceAfterTransaction(),
                        h.transactionType(),
                        h.counterpartyName(),
                        h.counterpartyAccountNumber(),
                        h.description(),
                        h.transactionDate()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ChargePayAmountResponse viewPayBalance(Integer userId) {
        Account payAccount = payDao.findPayAccountByUserId(userId);
        if (payAccount == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND_EXCEPTION);
        }
        return new ChargePayAmountResponse(payAccount.balance());
    }
}
