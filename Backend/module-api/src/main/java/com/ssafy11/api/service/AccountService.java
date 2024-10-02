package com.ssafy11.api.service;

import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.PayHistory;

import java.time.LocalDate;
import java.util.List;

public interface AccountService {
    Account createAccount(Integer userId, String bankCode);
    Account connectAccount(Integer userId, String accountNumber);
    List<Account> findAllAccounts(Integer userId, String bankCode);
    Account connectedAccount(Integer userId);
    Account findByAccountNumber(String accountNumber);
    Account findByAccountId(Integer accountId);
    PayHistory chargeBalance(String accountNumber, Long amount);
    PayHistory sendMoney(String senderAccountNumber, String info, String targetAccountNumber, Long amount);
    List<PayHistory> findPayHistory(String accountNumber, LocalDate startDate, LocalDate endDate, String payType);
}
