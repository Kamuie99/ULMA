package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.pay.ReceiveHistoryDTO;
import com.ssafy11.api.dto.pay.SendHistoryDTO;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.PayDao;
import com.ssafy11.domain.Pay.ReceiveHistory;
import com.ssafy11.domain.Pay.SendHistory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class PayServiceImplTest {

    @Mock
    private PayDao payDao;

    @InjectMocks
    private PayServiceImpl payService;

    private Account account;
    private SendHistory sendHistory;
    private ReceiveHistory receiveHistory;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        account = new Account(1, 1, "1234-5678", 10000L, "얼마페이", null);

        sendHistory = new SendHistory(1, 1, 5000L, 5000L, "targetUser", "1234-5678", "송금", LocalDateTime.now());
        receiveHistory = new ReceiveHistory(1, 1, 5000L, 15000L, "senderUser", "8765-4321", "충전", LocalDateTime.now());
    }

    @Test
    void testCreatePayAccount() {
        when(payDao.createPayAccount(anyInt())).thenReturn(account);

        AccountDTO createdAccount = payService.createPayAccount(1);

        assertNotNull(createdAccount);
        assertEquals("1234-5678", createdAccount.accountNumber());
        verify(payDao, times(1)).createPayAccount(anyInt());
    }

    @Test
    void testChargeBalance() {
        when(payDao.chargeBalance(anyInt(), anyLong())).thenReturn(receiveHistory);

        ReceiveHistoryDTO chargedBalance = payService.chargeBalance(1, 5000L);

        assertNotNull(chargedBalance);
        assertEquals(5000L, chargedBalance.amount());
        verify(payDao, times(1)).chargeBalance(anyInt(), anyLong());
    }

    @Test
    void testSendMoney() {
        when(payDao.sendMoney(anyInt(), anyString(), anyString(), anyLong(), anyString())).thenReturn(sendHistory);

        SendHistoryDTO sentMoney = payService.sendMoney(1, "targetUser", "1234-5678", 5000L, "송금");

        assertNotNull(sentMoney);
        assertEquals(5000L, sentMoney.amount());
        verify(payDao, times(1)).sendMoney(anyInt(), anyString(), anyString(), anyLong(), anyString());
    }

    @Test
    void testChargePayBalance() {
        when(payDao.chargePayBalance(anyInt(), anyLong())).thenReturn(receiveHistory);

        ReceiveHistoryDTO chargedPayBalance = payService.chargePayBalance(1, 5000L);

        assertNotNull(chargedPayBalance);
        assertEquals(5000L, chargedPayBalance.amount());
        verify(payDao, times(1)).chargePayBalance(anyInt(), anyLong());
    }

    @Test
    void testSendPayMoney() {
        when(payDao.sendPayMoney(anyInt(), anyString(), anyLong())).thenReturn(sendHistory);

        SendHistoryDTO sentPayMoney = payService.sendPayMoney(1, "1234-5678", 5000L);

        assertNotNull(sentPayMoney);
        assertEquals(5000L, sentPayMoney.amount());
        verify(payDao, times(1)).sendPayMoney(anyInt(), anyString(), anyLong());
    }

    @Test
    void testViewPayHistory() {
        when(payDao.findSendHistoryByUserId(anyInt())).thenReturn(List.of(sendHistory));

        List<SendHistoryDTO> history = payService.viewPayHistory(1);

        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals(5000L, history.get(0).amount());
        verify(payDao, times(1)).findSendHistoryByUserId(anyInt());
    }

    @Test
    void testViewPayBalance() {
        when(payDao.findPayAccountByUserId(anyInt())).thenReturn(account);

        Long balance = payService.viewPayBalance(1);

        assertNotNull(balance);
        assertEquals(10000L, balance);
        verify(payDao, times(1)).findPayAccountByUserId(anyInt());
    }
}
