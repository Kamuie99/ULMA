package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.account.ChargePayBalanceResponse;
import com.ssafy11.api.dto.pay.PayHistoryDTO;

import java.time.LocalDate;
import java.util.List;

public interface PayService {

    AccountDTO createPayAccount(Integer userId);

    PayHistoryDTO chargePayBalance(Integer userId, Long amount);

    PayHistoryDTO sendPayMoney(Integer userId, String info, String targetAccountNumber, Long amount);

    List<PayHistoryDTO> viewPayHistory(Integer userId, LocalDate startDate, LocalDate endDate, String payType);  // Pay 내역 조회

    ChargePayBalanceResponse viewPayBalance(Integer userId);  // Pay 잔액 조회
}
