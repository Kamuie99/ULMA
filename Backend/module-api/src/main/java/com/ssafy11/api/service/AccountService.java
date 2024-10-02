package com.ssafy11.api.service;

import com.ssafy11.domain.Account.Account;

import java.util.List;

public interface AccountService {
    Account createAccount(Integer userId, String bankCode);  // BankCode -> String
    Account connectAccount(Integer userId, String accountNumber);
    List<Account> findAllAccounts(Integer userId, String bankCode);  // BankCode -> String
    Account connectedAccount(Integer userId);
    Account findByAccountNumber(String accountNumber);
    Account findByAccountId(Integer accountId);
}
