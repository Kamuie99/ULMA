package com.ssafy11.domain.Account;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AccountDaoImpl implements AccountDao {

    private final DSLContext dsl;


    @Override
    public Account createAccount(Integer userId, CreateAccount account) {
        return null;
    }
}
