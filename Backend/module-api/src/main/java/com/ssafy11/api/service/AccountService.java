package com.ssafy11.api.service;

import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.BankCode;

import java.util.List;

public interface AccountService {
    Account createAccount(Integer userId, BankCode bankCode);
    Account connectAccount(Integer userId, String accountNumber);
    List<Account> findAllAccounts(Integer userId);
    Account connectedAccount(Integer userId);
    Account findByAccountNumber(String accountNumber);
    Account findByAccountId(Integer accountId);
}
