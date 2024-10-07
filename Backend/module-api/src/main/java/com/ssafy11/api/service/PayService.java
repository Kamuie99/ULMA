package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.account.ChargePayBalanceResponse;
import com.ssafy11.api.dto.pay.PayHistoryDTO;
import com.ssafy11.domain.Account.PaginatedHistory;

import java.time.LocalDate;

public interface PayService {

    AccountDTO createPayAccount(Integer userId);

    PayHistoryDTO chargePayBalance(Integer userId, Long amount);

    PayHistoryDTO sendPayMoney(Integer userId, String info, String targetAccountNumber, Long amount);

    PaginatedHistory<PayHistoryDTO> viewPayHistory(Integer userId, LocalDate startDate, LocalDate endDate, String payType, Integer page, Integer size);

    ChargePayBalanceResponse viewPayBalance(Integer userId);


}
