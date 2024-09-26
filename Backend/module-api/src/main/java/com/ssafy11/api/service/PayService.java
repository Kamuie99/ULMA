package com.ssafy11.api.service;

import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.accounts.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayService {

    private final AccountDao accountDao;
    private final TransactionDao transactionDao;

    @Transactional
    public Account createPay(Integer userId) {
        // 먼저 해당 유저에게 동일한 bankCode가 있는지 확인
        List<Account> existingAccounts = accountDao.findByUserId(userId, "얼마페이");

        if (!existingAccounts.isEmpty()) {
            // 이미 같은 bankCode의 계좌가 있는 경우 예외를 발생시킴
            throw new ErrorException(ErrorCode.AlreadyExistPay);
        }

        // 계좌가 없으면 새 계좌를 저장
        return accountDao.save(userId,
                new CreateAccount(userId,0L,"얼마페이"));
    }


    @Transactional
    public Long changeCharge(Integer userId, Long amount, CreateTransaction transaction) {
        Account account = this.getPay(userId);
        if (account.balance() + amount < 0) {
            throw new ErrorException(ErrorCode.NotEnoughFundsException);
        }
        transactionDao.save(userId, transaction);

        return accountDao.changeBalance(account.accountId(), amount);
    }

    public Account getPay(Integer userId) {
        return accountDao.findByUserId(userId, "얼마페이").get(0);
    }
}
