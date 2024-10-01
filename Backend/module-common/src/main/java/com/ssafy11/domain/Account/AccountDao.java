package com.ssafy11.domain.Account;

import java.util.List;

public interface AccountDao {
    Account createAccount(Integer userId, String bankCode);  // BankCode -> String
    Account connectAccount(Integer userid, String accountNumber);
    List<Account> findAllAccounts(Integer userId, String bankCode);  // BankCode -> String
    Account connectedAccount(Integer userId);
    Account findByAccountNumber(String accountNumber);
    Account findByAccountId(Integer accountId);
}
