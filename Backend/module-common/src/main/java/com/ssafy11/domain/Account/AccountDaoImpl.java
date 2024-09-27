package com.ssafy11.domain.Account;

import com.ssafy11.ulma.generated.tables.Users;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ssafy11.ulma.generated.tables.Account.ACCOUNT;
import static com.ssafy11.ulma.generated.tables.Users.USERS;

@Repository
@RequiredArgsConstructor
public class AccountDaoImpl implements AccountDao {

    private final DSLContext dsl;

    @Override
    public Account createAccount(Integer userId, CreateAccount account) {
        int accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, userId)
                .set(ACCOUNT.ACCOUNT_NUMBER, account.accountNumber())
                .set(ACCOUNT.BANK_CODE, account.bankCode())
                .execute();
        return dsl.select(ACCOUNT)
                .where(ACCOUNT.ID.eq(accountId))
                .fetchOneInto(Account.class);
    }

    @Override
    public Account connectAccount(Integer userid, String accountNumber) {
        dsl.update(USERS)
                .set(USERS.ACCOUNT_NUMBER, accountNumber)
                .execute();
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .fetchOneInto(Account.class);
    }

    @Override
    public List<Account> findAllAccounts(Integer userId) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .fetchInto(Account.class);
    }

    @Override
    public Account connectedAccount(Integer userId) {
        Users user = dsl.selectFrom(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(Users.class);
        
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(user.ACCOUNT_NUMBER))
                .fetchOneInto(Account.class);
    }
    @Override
    public Account findByAccountNumber(String accountNumber) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .fetchOneInto(Account.class);
    }

    @Override
    public Account findByAccountId(Integer accountId) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ID.eq(accountId))
                .fetchOneInto(Account.class);
    }

}
