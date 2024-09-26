package com.ssafy11.domain.accounts;

import java.util.List;

public interface AccountDao {
    Account save(Integer userId, CreateAccount account);
    Account findByAccountId(Integer accountId);
    Account findByAccountNumber(String accountNumber);
    List<Account> findByUserId(Integer userId);
    List<Account> findByUserId(Integer userId, String bankCode);
    Account chooseAccount(Integer userId, String accountNumber);
    Account getConnectedAccount(Integer userId);
    boolean deleteConnectedAccount(Integer userId);
    Long changeBalance(Integer accountId, Long amount);
}
