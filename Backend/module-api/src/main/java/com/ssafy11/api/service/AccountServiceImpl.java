package com.ssafy11.api.service;

import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.AccountDao;
import com.ssafy11.domain.Account.BankCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {
    private final AccountDao accountDao;

    @Override
    @Transactional
    public Account createAccount(Integer userId, BankCode bankCode) {
        return accountDao.createAccount(userId, bankCode);
    }

    @Override
    @Transactional
    public Account connectAccount(Integer userId, String accountNumber) {
        return accountDao.connectAccount(userId, accountNumber);
    }

    @Override
    public List<Account> findAllAccounts(Integer userId) {
        return accountDao.findAllAccounts(userId);
    }

    @Override
    public Account connectedAccount(Integer userId) {
        return accountDao.connectedAccount(userId);
    }

    @Override
    public Account findByAccountNumber(String accountNumber) {
        return accountDao.findByAccountNumber(accountNumber);
    }

    @Override
    public Account findByAccountId(Integer accountId) {
        return accountDao.findByAccountId(accountId);
    }
}
