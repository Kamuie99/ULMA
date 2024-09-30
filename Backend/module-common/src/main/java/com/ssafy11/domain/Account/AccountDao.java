package com.ssafy11.domain.Account;

import java.util.List;

public interface AccountDao {
    Account createAccount(Integer userId, BankCode bankCode);
    Account connectAccount(Integer userid, String accountNumber);
    List<Account> findAllAccounts(Integer userId, BankCode bankCode);
    Account connectedAccount(Integer userId);
    Account findByAccountNumber(String accountNumber);
    Account findByAccountId(Integer accountId);
}
