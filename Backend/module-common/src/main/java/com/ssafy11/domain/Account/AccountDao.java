package com.ssafy11.domain.Account;

public interface AccountDao {
    Account createAccount(Integer userId, CreateAccount account);
}
