package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.VerifyNumber;
import com.ssafy11.api.dto.pay.PayHistoryDTO;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.PaginatedHistory;

import java.time.LocalDate;
import java.util.List;

public interface AccountService {
    Account createAccount(Integer userId, String bankCode);
    Account connectAccount(Integer userId, String bankCode, String accountNumber);
    List<Account> findAllAccounts(Integer userId, String bankCode);
    Account connectedAccount(Integer userId);
    Account findByAccountNumber(String accountNumber);
    Account findByAccountId(Integer accountId);
    PayHistoryDTO chargeBalance(String accountNumber, Long amount);
    PayHistoryDTO sendMoney(String senderAccountNumber, String info, String targetAccountNumber, Long amount);
    PaginatedHistory findPayHistory(String accountNumber, LocalDate startDate, LocalDate endDate, String payType, int page, int size);
    VerifyNumber verifyMyAccount(Integer userId, String bankCode, String accountNumber);
}
