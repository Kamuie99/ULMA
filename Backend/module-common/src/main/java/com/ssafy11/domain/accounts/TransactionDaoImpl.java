package com.ssafy11.domain.accounts;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy11.ulma.generated.Tables.TRANSACTION;

@RequiredArgsConstructor
@Repository
public class TransactionDaoImpl implements TransactionDao{

    private final DSLContext dsl;

    @Override
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
    public Integer makeTransaction(Transaction transaction) {
        return dsl.insertInto(TRANSACTION)
                .set(TRANSACTION.ACCOUNT_ID, transaction.accountId())
                .set(TRANSACTION.AMOUNT, transaction.amount())
                .set(TRANSACTION.TRANSACTION_DATE, transaction.transactionDate())
                .set(TRANSACTION.BALANCE, transaction.balance())
                .set(TRANSACTION.TARGET, transaction.target())
                .returning(TRANSACTION.TRANSACTION_ID)
                .fetchOne()
                .getTransactionId();
    }

    @Override
    public List<Transaction> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        // startDate와 endDate를 설정하는 메서드 호출
        LocalDateTime[] dateRange = getValidatedDateRange(startDate, endDate);
        startDate = dateRange[0];
        endDate = dateRange[1];

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

    private LocalDateTime[] getValidatedDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        // startDate가 null일 경우 1달 전부터의 기록
        if (startDate == null) {
            startDate = LocalDateTime.now().minusWeeks(1);
        }

        // endDate가 null일 경우 오늘 날짜
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        return new LocalDateTime[]{startDate, endDate};
    }
}
