package com.ssafy11.api.service;

import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.PayAccount;
import com.ssafy11.domain.Pay.PayDao;
import com.ssafy11.domain.Pay.ReceiveHistory;
import com.ssafy11.domain.Pay.SendHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PayServiceImpl implements PayService {

    private final PayDao payDao;

    @Override
    public Account createPayAccount(Integer userId) {
        return payDao.createPayAccount(userId);
    }

    @Override
    public ReceiveHistory chargeBalance(Integer accountId, Long amount) {
        return payDao.chargeBalance(accountId, amount);
    }

    @Override
    public SendHistory sendMoney(Integer accountId, String target, String targetAccountNumber, Long amount, String info) {
        return payDao.sendMoney(accountId, target, targetAccountNumber, amount, info);
    }

    @Override
    public ReceiveHistory chargePayBalance(Integer userId, Long amount) {
        return payDao.chargePayBalance(userId, amount);
    }

    @Override
    public SendHistory sendPayMoney(Integer userId, Integer accountId, String targetAccountNumber, Long amount) {
        return payDao.sendPayMoney(userId, accountId, targetAccountNumber, amount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SendHistory> viewPayHistory(Integer userId) {
        // Pay 내역 조회 로직 구현
        return payDao.findSendHistoryByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long viewPayBalance(Integer userId) {
        // 사용자의 얼마페이 계좌를 조회한 후 잔액 반환
        Account payAccount = payDao.findPayAccountByUserId(userId);
        return payAccount != null ? payAccount.balance() : 0L;
    }
}
