package com.ssafy11.domain.Pay;

import com.ssafy11.domain.Account.Account;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import static com.ssafy11.ulma.generated.tables.Account.ACCOUNT;

@RequiredArgsConstructor
@Repository
public class PayDaoImpl implements PayDao{

    private final DSLContext dsl;
    @Override
    public Account createPayAccount(Integer userId, PayAccount account) {
        int accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, userId)
                .set(ACCOUNT.ACCOUNT_NUMBER, account.accountNumber())
                .set(ACCOUNT.BANK_CODE, "얼마페이")
                .execute();
        return dsl.select(ACCOUNT)
                .where(ACCOUNT.ID.eq(accountId))
                .fetchOneInto(Account.class);
    }
}
