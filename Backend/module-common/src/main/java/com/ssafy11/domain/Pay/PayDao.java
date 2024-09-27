package com.ssafy11.domain.Pay;

import com.ssafy11.domain.Account.Account;

import java.util.List;


public interface PayDao {
    // 계좌 생성
    Account createPayAccount(Integer userId);

    // 계좌 잔액 충전
    ReceiveHistory chargeBalance(Integer accountId, Long amount);

    // 계좌 간 송금
    SendHistory sendMoney(Integer accountId, String target, String targetAccountNumber, Long amount, String info);

    // 얼마페이 계좌 충전
    ReceiveHistory chargePayBalance(Integer accountId, Long amount);

    // 얼마페이 계좌에서 다른 계좌로 송금
    SendHistory sendPayMoney(Integer userId, Integer accountId, String targetAccountNumber, Long amount);

    // 송금 내역 생성
    SendHistory createSendHistory(String accountNumber, Long amount, String target, String targetAccountNumber, String info);

    // 수신 내역 생성
    ReceiveHistory createReceiveHistory(String accountNumber, Long amount, String sender, String senderAccountNumber, String info);

    List<SendHistory> findSendHistoryByUserId(Integer userId);
    Account findPayAccountByUserId(Integer userId);
}
