package com.ssafy11.api.service;

import com.ssafy11.domain.accounts.Account;
import com.ssafy11.domain.accounts.AccountDaoImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {
    private final AccountDaoImpl accountDao;

    public Account createAccount(Account account) {
        return accountDao.save(account);
    }
}
