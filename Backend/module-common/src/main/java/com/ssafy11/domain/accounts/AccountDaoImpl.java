package com.ssafy11.domain.accounts;

import com.ssafy11.ulma.generated.Tables;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.ssafy11.ulma.generated.Tables.USERS;
import static com.ssafy11.ulma.generated.tables.Account.ACCOUNT;

@RequiredArgsConstructor
@Repository
public class AccountDaoImpl implements AccountDao {

    private final DSLContext dsl;

    @Override
    public Account save(Integer userId, CreateAccount account) {
        // uuid로 계좌번호 생성
        String uuid = UUID.randomUUID().toString().replaceAll("[^0-9]", "");
        while (uuid.charAt(0) == 0) {
            uuid = UUID.randomUUID().toString().replaceAll("[^0-9]", "");
        }
        Integer accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, userId)
                .set(ACCOUNT.ACCOUNT_NUMBER, uuid)
                .set(ACCOUNT.BALANCE, account.balance())
                .set(ACCOUNT.BANK_CODE, account.bankCode())
                .returning(ACCOUNT.ACCOUNT_ID)
                .fetchOne()
                .getValue(ACCOUNT.ACCOUNT_ID);

        return new Account(accountId, uuid, account.balance(), account.bankCode());
    }

    @Override
    public Account findByAccountId(Integer accountId) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_ID.eq(accountId))
                .fetchOneInto(Account.class);
    }

    @Override
    public Account findByAccountNumber(String accountNumber) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .fetchOneInto(Account.class);
    }

    @Override
    public List<Account> findByUserId(Integer userId) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .fetchInto(Account.class);
    }

    @Override
    public List<Account> findByUserId(Integer userId, String bankCode) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId)
                        .and(ACCOUNT.BANK_CODE.eq(bankCode)))
                .fetchInto(Account.class);
    }

    @Override
    @Transactional
    public Account chooseAccount(Integer userId, String accountNumber) {
        dsl.update(USERS)
                .set(USERS.ACCOUNT_NUMBER, accountNumber)
                .where(USERS.ID.eq(userId))
                .execute();

        return dsl.select(ACCOUNT)
                .from(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .fetchOneInto(Account.class);
    }

    @Override
    public Account getConnectedAccount(Integer userId) {
        String accountNumber = dsl.select(USERS.ACCOUNT_NUMBER)
                .from(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(String.class); // ACCOUNT_NUMBER가 String 타입이라고 가정

        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .fetchOneInto(Account.class);
    }

    @Override
    public boolean deleteConnectedAccount(Integer userId) {
        int res = dsl.update(USERS)
                .set(USERS.ACCOUNT_NUMBER, "none")
                .where(USERS.ID.eq(userId))
                .execute();
        return res > 0;
    }

    @Override
    public Long changeBalance(Integer accountId, Long newBalance) {
        dsl.update(ACCOUNT)
                .set(ACCOUNT.BALANCE, newBalance)
                .where(ACCOUNT.ACCOUNT_ID.eq(accountId))
                .execute();

        return newBalance;
    }


}
