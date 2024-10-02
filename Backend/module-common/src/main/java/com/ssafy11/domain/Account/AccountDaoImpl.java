package com.ssafy11.domain.Account;

import com.ssafy11.domain.users.Users;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import static com.ssafy11.ulma.generated.tables.Account.ACCOUNT;
import static com.ssafy11.ulma.generated.tables.Users.USERS;

@Repository
@RequiredArgsConstructor
public class AccountDaoImpl implements AccountDao {

    private final DSLContext dsl;

    @Override
    public Account createAccount(Integer userId, String bankCode) {
        String accountNumber = generateAccountNumber();

        Integer accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, userId)
                .set(ACCOUNT.ACCOUNT_NUMBER, accountNumber)
                .set(ACCOUNT.BANK_CODE, bankCode)
                .returning(ACCOUNT.ID)
                .fetchOne()
                .getValue(ACCOUNT.ID);

        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ID.eq(accountId))
                .fetchOneInto(Account.class);
    }


    private String generateAccountNumber() {
        String uuidNumeric = UUID.randomUUID().toString().replaceAll("[^0-9]", "");
        return uuidNumeric.substring(0, 4) + "-" + uuidNumeric.substring(4, 8);
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
    public List<Account> findAllAccounts(Integer userId, String bankCode) {  // BankCode -> String
        if (bankCode != null) {
            return dsl.selectFrom(ACCOUNT)
                    .where(ACCOUNT.USER_ID.eq(userId))
                    .and(ACCOUNT.BANK_CODE.eq(bankCode))  // String 처리
                    .fetchInto(Account.class);
        } else {
            return dsl.selectFrom(ACCOUNT)
                    .where(ACCOUNT.USER_ID.eq(userId))
                    .fetchInto(Account.class);
        }
    }

    @Override
    public Account connectedAccount(Integer userId) {
        Users user = dsl.selectFrom(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(Users.class);

        System.out.println(user);
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(user.getAccountNumber()))
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
