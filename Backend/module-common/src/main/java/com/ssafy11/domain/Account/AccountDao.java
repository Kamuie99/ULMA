package com.ssafy11.domain.Account;

import java.util.List;

public interface AccountDao {
    Account createAccount(Integer userId, CreateAccount account);
    Account connectAccount(Integer userid, String accountNumber);
    List<Account> findAllAccounts(Integer userId);
    Account connectedAccount(Integer userId);
}
