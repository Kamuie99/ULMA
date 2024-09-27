package com.ssafy11.api.service;

import com.ssafy11.domain.Pay.ReceiveHistory;
import com.ssafy11.domain.Pay.SendHistory;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.PayAccount;

import java.util.List;

public interface PayService {
    Account createPayAccount(Integer userId);
    ReceiveHistory chargeBalance(Integer accountId, Long amount);
    SendHistory sendMoney(Integer accountId, String target, String targetAccountNumber, Long amount, String info);
    ReceiveHistory chargePayBalance(Integer userId, Long amount);
    SendHistory sendPayMoney(Integer userId, Integer accountId, String targetAccountNumber, Long amount);
    List<SendHistory> viewPayHistory(Integer userId);  // Pay 내역 조회
    Long viewPayBalance(Integer userId);  // Pay 잔액 조회
}
