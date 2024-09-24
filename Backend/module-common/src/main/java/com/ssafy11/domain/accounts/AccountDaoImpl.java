package com.ssafy11.domain.accounts;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import static com.ssafy11.ulma.generated.tables.Account.ACCOUNT;

@RequiredArgsConstructor
@Repository
public class AccountDaoImpl implements AccountDao{

    private final DSLContext dsl;

    @Override
    public Account save(Account account) {
        Integer accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, account.userId())
                .set(ACCOUNT.ACCOUNT_NUMBER, account.accountNumber())
                .set(ACCOUNT.BALANCE, account.balance())
                .set(ACCOUNT.BANK_CODE, account.bankCode())
                .returning(ACCOUNT.ACCOUNT_ID)
                .fetchOne()
                .getValue(ACCOUNT.ACCOUNT_ID);

        // 삽입된 계좌 정보를 포함한 Account 객체를 반환
        return new Account(accountId, account.userId(), account.accountNumber(), account.balance(), account.bankCode());
    }
}
