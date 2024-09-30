package com.ssafy11.domain.Account;

import com.ssafy11.ulma.generated.tables.Users;
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
    public Account createAccount(Integer userId, BankCode bankCode) {
        String accountNumber = generateAccountNumber();

        int accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, userId)
                .set(ACCOUNT.ACCOUNT_NUMBER, accountNumber)
                .set(ACCOUNT.BANK_CODE, bankCode.name())
                .execute();
        return dsl.select(ACCOUNT)
                .where(ACCOUNT.ID.eq(accountId))
                .fetchOneInto(Account.class);
    }

    private String generateAccountNumber() {
        // UUID 생성 후 숫자로 변환
        String uuidNumeric = UUID.randomUUID().toString().replaceAll("[^0-9]", "");

        // 8자리 숫자 추출 (앞에서 8자리를 자르고, 4자리-4자리로 나누기)
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
    public List<Account> findAllAccounts(Integer userId, BankCode bankCode) {
        if (bankCode != null) {
            return dsl.selectFrom(ACCOUNT)
                    .where(ACCOUNT.USER_ID.eq(userId))
                    .and(ACCOUNT.BANK_CODE.eq(bankCode.getCode()))  // BankCode 필터 추가
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
