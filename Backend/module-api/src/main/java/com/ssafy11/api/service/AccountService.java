package com.ssafy11.api.service;

import com.ssafy11.domain.accounts.Account;
import com.ssafy11.domain.accounts.AccountDaoImpl;
import com.ssafy11.domain.accounts.CreateAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AccountService {
    private final AccountDaoImpl accountDao;

    @Transactional
    public Account createAccount(Integer userId, CreateAccount account) {
        return accountDao.save(userId, account);
    }

    public Account findByAccountId(Integer accountId) {
        return accountDao.findByAccountId(accountId);
    }

    public Account findByAccountNumber(String accountNumber) {
        return accountDao.findByAccountNumber(accountNumber);
    }

    public List<Account> findByUserId(Integer userId) {
        return accountDao.findByUserId(userId);
    }
}
