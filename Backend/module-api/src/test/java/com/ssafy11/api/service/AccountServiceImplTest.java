package com.ssafy11.api.service;

import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.AccountDao;
import com.ssafy11.domain.Account.BankCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AccountServiceImplTest {

    @Mock
    private AccountDao accountDao;

    @InjectMocks
    private AccountServiceImpl accountService;

    private Account account;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        account = new Account(1, 1, "1234-5678", 10000L, BankCode.한국은행.getCode(), null);
    }

    @Test
    void testCreateAccount() {
        when(accountDao.createAccount(anyInt(), any(BankCode.class)))
                .thenReturn(account);

        Account createdAccount = accountService.createAccount(1, BankCode.한국은행);

        assertNotNull(createdAccount);
        assertEquals("1234-5678", createdAccount.accountNumber());
        assertEquals(BankCode.한국은행.getCode(), createdAccount.bankCode());
        verify(accountDao, times(1)).createAccount(anyInt(), any(BankCode.class));
    }

    @Test
    void testConnectAccount() {
        when(accountDao.connectAccount(anyInt(), anyString()))
                .thenReturn(account);

        Account connectedAccount = accountService.connectAccount(1, "1234-5678");

        assertNotNull(connectedAccount);
        assertEquals("1234-5678", connectedAccount.accountNumber());
        verify(accountDao, times(1)).connectAccount(anyInt(), anyString());
    }

    @Test
    void testFindAllAccountsWithoutBankCode() {
        when(accountDao.findAllAccounts(anyInt(), any()))
                .thenReturn(List.of(account));

        // BankCode 없이 모든 계좌 조회
        List<Account> accounts = accountService.findAllAccounts(1, null);

        assertNotNull(accounts);
        assertFalse(accounts.isEmpty());
        assertEquals(1, accounts.size());
        verify(accountDao, times(1)).findAllAccounts(anyInt(), isNull());
    }

    @Test
    void testFindAllAccountsWithBankCode() {
        when(accountDao.findAllAccounts(anyInt(), any(BankCode.class)))
                .thenReturn(List.of(account));

        // 특정 BankCode로 계좌 조회
        List<Account> accounts = accountService.findAllAccounts(1, BankCode.한국은행);

        assertNotNull(accounts);
        assertFalse(accounts.isEmpty());
        assertEquals(1, accounts.size());
        assertEquals(BankCode.한국은행.getCode(), accounts.get(0).bankCode());
        verify(accountDao, times(1)).findAllAccounts(anyInt(), any(BankCode.class));
    }

    @Test
    void testConnectedAccount() {
        when(accountDao.connectedAccount(anyInt()))
                .thenReturn(account);

        Account connectedAccount = accountService.connectedAccount(1);

        assertNotNull(connectedAccount);
        assertEquals("1234-5678", connectedAccount.accountNumber());
        verify(accountDao, times(1)).connectedAccount(anyInt());
    }

    @Test
    void testFindByAccountNumber() {
        when(accountDao.findByAccountNumber(anyString()))
                .thenReturn(account);

        Account foundAccount = accountService.findByAccountNumber("1234-5678");

        assertNotNull(foundAccount);
        assertEquals("1234-5678", foundAccount.accountNumber());
        verify(accountDao, times(1)).findByAccountNumber(anyString());
    }

    @Test
    void testFindByAccountId() {
        when(accountDao.findByAccountId(anyInt()))
                .thenReturn(account);

        Account foundAccount = accountService.findByAccountId(1);

        assertNotNull(foundAccount);
        assertEquals(1, foundAccount.id());
        verify(accountDao, times(1)).findByAccountId(anyInt());
    }
}
