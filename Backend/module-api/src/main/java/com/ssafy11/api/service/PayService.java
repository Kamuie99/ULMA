package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.pay.ReceiveHistoryDTO;
import com.ssafy11.api.dto.pay.SendHistoryDTO;

import java.util.List;

public interface PayService {

    AccountDTO createPayAccount(Integer userId);

    ReceiveHistoryDTO chargeBalance(Integer accountId, Long amount);

    SendHistoryDTO sendMoney(Integer accountId, String target, String targetAccountNumber, Long amount, String info);

    ReceiveHistoryDTO chargePayBalance(Integer userId, Long amount);

    SendHistoryDTO sendPayMoney(Integer userId, String targetAccountNumber, Long amount);

    List<SendHistoryDTO> viewPayHistory(Integer userId);  // Pay 내역 조회

    Long viewPayBalance(Integer userId);  // Pay 잔액 조회
}
