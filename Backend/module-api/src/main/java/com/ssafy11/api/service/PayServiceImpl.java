package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.pay.ReceiveHistoryDTO;
import com.ssafy11.api.dto.pay.SendHistoryDTO;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.PayDao;
import com.ssafy11.domain.Pay.ReceiveHistory;
import com.ssafy11.domain.Pay.SendHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PayServiceImpl implements PayService {

    private final PayDao payDao;

    @Override
    public AccountDTO createPayAccount(Integer userId) {
        Account createdAccount = payDao.createPayAccount(userId);
        return new AccountDTO(
                createdAccount.accountNumber(),
                createdAccount.balance(),
                createdAccount.bankCode()
        );
    }

    @Override
    public ReceiveHistoryDTO chargeBalance(Integer accountId, Long amount) {
        ReceiveHistory receiveHistory = payDao.chargeBalance(accountId, amount);
        return new ReceiveHistoryDTO(
                receiveHistory.amount(),
                receiveHistory.senderAccountNumber(),
                receiveHistory.info(),
                receiveHistory.transactionDate()
        );
    }

    @Override
    public SendHistoryDTO sendMoney(Integer accountId, String target, String targetAccountNumber, Long amount, String info) {
        SendHistory sendHistory = payDao.sendMoney(accountId, target, targetAccountNumber, amount, info);
        return new SendHistoryDTO(
                sendHistory.amount(),
                sendHistory.targetAccountNumber(),
                sendHistory.info(),
                sendHistory.transactionDate()
        );
    }

    @Override
    public ReceiveHistoryDTO chargePayBalance(Integer userId, Long amount) {
        ReceiveHistory receiveHistory = payDao.chargePayBalance(userId, amount);
        return new ReceiveHistoryDTO(
                receiveHistory.amount(),
                receiveHistory.senderAccountNumber(),
                receiveHistory.info(),
                receiveHistory.transactionDate()
        );
    }

    @Override
    public SendHistoryDTO sendPayMoney(Integer userId, String targetAccountNumber, Long amount) {
        SendHistory sendHistory = payDao.sendPayMoney(userId, targetAccountNumber, amount);
        return new SendHistoryDTO(
                sendHistory.amount(),
                sendHistory.targetAccountNumber(),
                sendHistory.info(),
                sendHistory.transactionDate()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<SendHistoryDTO> viewPayHistory(Integer userId) {
        List<SendHistory> history = payDao.findSendHistoryByUserId(userId);
        return history.stream()
                .map(h -> new SendHistoryDTO(
                        h.amount(),
                        h.targetAccountNumber(),
                        h.info(),
                        h.transactionDate()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long viewPayBalance(Integer userId) {
        Account payAccount = payDao.findPayAccountByUserId(userId);
        return payAccount != null ? payAccount.balance() : 0L;
    }
}
