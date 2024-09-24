package com.ssafy11.domain.accounts;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy11.ulma.generated.Tables.TRANSACTION;

@RequiredArgsConstructor
@Repository
@Transactional(readOnly = true)
public class TransactionImpl implements TransactionDao{

    private final DSLContext dsl;

    @Override
    @Transactional
    public Integer save(Transaction transaction) {
        return dsl.insertInto(TRANSACTION)
                .set(TRANSACTION.ACCOUNT_ID, transaction.accountId())
                .set(TRANSACTION.AMOUNT, transaction.amount())
                .set(TRANSACTION.TRANSACTION_DATE, transaction.transactionDate())
                .set(TRANSACTION.BALANCE, transaction.balance())
                .set(TRANSACTION.TARGET, transaction.target())
                .returning(TRANSACTION.TRANSACTION_ID)
                .fetchOne()
                .getAccountId();
    }

    @Override
    public List<Transaction> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return dsl.selectFrom(TRANSACTION)
                .where(TRANSACTION.TRANSACTION_DATE.between(startDate, endDate))
                .fetchInto(Transaction.class);
    }

    @Override
    public List<Transaction> findByTarget(String target) {
        return dsl.selectFrom(TRANSACTION)
                .where(TRANSACTION.TARGET.eq(target))
                .fetchInto(Transaction.class);
    }

    @Override
    public List<Transaction> findByAmountSign(boolean isPositive) {
        if (isPositive) {
            return dsl.selectFrom(TRANSACTION)
                    .where(TRANSACTION.AMOUNT.gt(0L))
                    .fetchInto(Transaction.class);
        } else {
            return dsl.selectFrom(TRANSACTION)
                    .where(TRANSACTION.AMOUNT.lt(0L))
                    .fetchInto(Transaction.class);
        }
    }
}
