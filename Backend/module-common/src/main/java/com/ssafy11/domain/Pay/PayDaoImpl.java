package com.ssafy11.domain.Pay;

import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.AccountDao;
import com.ssafy11.ulma.generated.tables.records.AccountRecord;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.SelectConditionStep;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static com.ssafy11.ulma.generated.Tables.PAYHISTORY;
import static com.ssafy11.ulma.generated.Tables.USERS;
import static com.ssafy11.ulma.generated.tables.Account.ACCOUNT;


@RequiredArgsConstructor
@Repository
public class PayDaoImpl implements PayDao {

    private final DSLContext dsl;
    private final AccountDao accountDao;

    @Override
    public Account createPayAccount(Integer userId) {
        String accountNumber = generateAccountNumber();

        Integer accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, userId)
                .set(ACCOUNT.ACCOUNT_NUMBER, accountNumber)
                .set(ACCOUNT.BANK_CODE, "얼마페이")
                .returning(ACCOUNT.ID)
                .fetchOne()
                .getValue(ACCOUNT.ID);

        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ID.eq(accountId))
                .fetchOneInto(Account.class);
    }


    private String generateAccountNumber() {
        // UUID 생성 후 숫자로 변환
        String uuidNumeric = UUID.randomUUID().toString().replaceAll("[^0-9]", "");

        // 8자리 숫자 추출 (앞에서 8자리를 자르고, 4자리-4자리로 나누기)
        return uuidNumeric.substring(0, 4) + "-" + uuidNumeric.substring(4, 8);
    }

    public PayHistory sendMoney(Integer accountId, String target, String targetAccountNumber, Long amount, String info) {
        Account sendAccount = accountDao.findByAccountId(accountId);
        Account targetAccount = accountDao.findByAccountNumber(targetAccountNumber);

        if (sendAccount != null && targetAccount != null && sendAccount.balance() >= amount) {
            // 1. 송금하는 계좌에서 잔액 차감
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.subtract(amount))
                    .where(ACCOUNT.ID.eq(accountId))
                    .execute();

            // 2. 받는 사람의 계좌에 잔액 추가
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.add(amount))
                    .where(ACCOUNT.ID.eq(targetAccount.id()))
                    .execute();

            // 3. 송금 내역(PayHistory) 생성
            PayHistory sendHistory = createSendHistory(
                    sendAccount.accountNumber(),
                    amount,
                    target,
                    targetAccountNumber,
                    info
            );

            // 4. 받는 사람의 수신 내역(PayHistory) 생성
            createReceiveHistory(
                    targetAccount.accountNumber(),
                    amount,
                    sendAccount.accountNumber(),
                    sendAccount.accountNumber()
            );

            return sendHistory;
        }

        return null;
    }



    @Override
    public PayHistory chargePayBalance(Integer userId, Long amount) {
        // users 테이블에서 account_number를 가져옴
        String userAccountNumber = dsl.select(USERS.ACCOUNT_NUMBER)
                .from(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(String.class);
        if (userAccountNumber == null) {
            return null;
        }
        // account 테이블에서 사용자의 account_number를 가진 원래 계좌를 찾음
        Account connectedAccount = accountDao.findByAccountNumber(userAccountNumber);

        // 사용자의 얼마페이 계좌를 조회
        Account payAccount = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .and(ACCOUNT.BANK_CODE.eq("얼마페이"))
                .fetchOneInto(Account.class);

        // 원래 계좌와 얼마페이 계좌가 모두 존재해야 함
        if (connectedAccount != null && payAccount != null && connectedAccount.balance() >= amount) {
            // 1. 원래 계좌에서 잔액 차감
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.subtract(amount))
                    .where(ACCOUNT.ID.eq(connectedAccount.id()))
                    .execute();

            // 2. 얼마페이 계좌에 잔액 충전
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.add(amount))
                    .where(ACCOUNT.ID.eq(payAccount.id()))
                    .execute();

            // 3. 원래 계좌에서 송금 내역(PayHistory) 생성
            PayHistory sendHistory = createSendHistory(
                    connectedAccount.accountNumber(),
                    amount,
                    "얼마페이",
                    payAccount.accountNumber(),
                    "얼마페이 충전"
            );

            // 4. 얼마페이 계좌에서 수신 내역(PayHistory) 생성

            String senderUserName = dsl.select(USERS.NAME)
                    .from(USERS)
                    .where(USERS.ID.eq(connectedAccount.userId()))
                    .fetchOneInto(String.class);

            PayHistory receiveHistory = createReceiveHistory(
                    payAccount.accountNumber(),
                    amount,
                    senderUserName,
                    connectedAccount.accountNumber()
            );

            return receiveHistory;
        }

        return null;
    }

    @Override
    public PayHistory sendPayMoney(Integer userId, String info, String targetAccountNumber, Long amount) {
        // 1. 사용자의 얼마페이 계좌를 조회
        Account payAccount = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .and(ACCOUNT.BANK_CODE.eq("얼마페이"))  // 얼마페이 계좌
                .fetchOneInto(Account.class);

        // 2. 받는 사람의 계좌 조회
        Account targetAccount = accountDao.findByAccountNumber(targetAccountNumber);

        // 3. 송금 대상 사용자의 이름을 조회
        String targetUserName = dsl.select(USERS.NAME)
                .from(USERS)
                .where(USERS.ID.eq(targetAccount.userId()))
                .fetchOneInto(String.class);

        // 4. 보내는 사람의 이름을 조회
        String senderUserName = dsl.select(USERS.NAME)
                .from(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(String.class);

        // 5. 송금 처리
        if (payAccount != null && targetAccount != null && payAccount.balance() >= amount) {
            // 6. 얼마페이 계좌에서 잔액 차감
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.subtract(amount))
                    .where(ACCOUNT.ID.eq(payAccount.id()))
                    .execute();

            // 7. 받는 사람의 계좌에 잔액 추가
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.add(amount))
                    .where(ACCOUNT.ID.eq(targetAccount.id()))
                    .execute();

            // 8. 송금 내역(PayHistory) 생성, 송금 대상과 보내는 사람의 이름 사용
            PayHistory sendHistory = createSendHistory(
                    payAccount.accountNumber(),
                    amount,
                    targetUserName,
                    targetAccountNumber,
                    info
            );

            // 9. 수신 내역(PayHistory) 생성, 보내는 사람의 이름 사용
            createReceiveHistory(
                    targetAccount.accountNumber(),
                    amount,
                    senderUserName,
                    payAccount.accountNumber()
            );

            return sendHistory;
        }

        return null;
    }

    public PayHistory createSendHistory(String accountNumber, Long amount, String target, String targetAccountNumber, String info) {
        Account sendAccount = accountDao.findByAccountNumber(accountNumber);

        if (sendAccount != null) {
            // 송금 내역 생성
            int sendId = dsl.insertInto(PAYHISTORY)
                    .set(PAYHISTORY.ACCOUNT_ID, sendAccount.id())
                    .set(PAYHISTORY.AMOUNT, amount)
                    .set(PAYHISTORY.BALANCE_AFTER_TRANSACTION, sendAccount.balance())
                    .set(PAYHISTORY.TRANSACTION_TYPE, PayType.SEND.name())
                    .set(PAYHISTORY.COUNTERPARTY_NAME, target)
                    .set(PAYHISTORY.COUNTERPARTY_ACCOUNT_NUMBER, targetAccountNumber)
                    .set(PAYHISTORY.DESCRIPTION, info)
                    .returning(PAYHISTORY.ID)
                    .fetchOne()
                    .getValue(PAYHISTORY.ID);

            return dsl.selectFrom(PAYHISTORY)
                    .where(PAYHISTORY.ID.eq(sendId))
                    .fetchOneInto(PayHistory.class);
        }
        return null;
    }


    public PayHistory createReceiveHistory(String accountNumber, Long amount, String sender, String senderAccountNumber) {
        Account receiveAccount = accountDao.findByAccountNumber(accountNumber);

        if (receiveAccount != null) {
            int receiveId = dsl.insertInto(PAYHISTORY)
                    .set(PAYHISTORY.ACCOUNT_ID, receiveAccount.id())
                    .set(PAYHISTORY.AMOUNT, amount)
                    .set(PAYHISTORY.BALANCE_AFTER_TRANSACTION, receiveAccount.balance())
                    .set(PAYHISTORY.TRANSACTION_TYPE, PayType.RECEIVE.name())
                    .set(PAYHISTORY.COUNTERPARTY_NAME, sender)
                    .set(PAYHISTORY.COUNTERPARTY_ACCOUNT_NUMBER, senderAccountNumber)
                    .set(PAYHISTORY.DESCRIPTION, sender)
                    .returning(PAYHISTORY.ID)
                    .fetchOne()
                    .getValue(PAYHISTORY.ID);

            return dsl.selectFrom(PAYHISTORY)
                    .where(PAYHISTORY.ID.eq(receiveId))
                    .fetchOneInto(PayHistory.class);
        }
        return null;
    }

    @Override
    public List<PayHistory> findPayHistory(Integer userId, LocalDate startDate, LocalDate endDate, String payType) {
        // 1. 해당 userId의 얼마페이 계좌 조회
        Account payAccount = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .and(ACCOUNT.BANK_CODE.eq("얼마페이"))
                .fetchOneInto(Account.class);

        // 2. 해당 계좌의 PayHistory 내역 조회
        if (payAccount != null) {
            var query = dsl.selectFrom(PAYHISTORY)
                    .where(PAYHISTORY.ACCOUNT_ID.eq(payAccount.id()));

            // 3. 시작날짜와 끝날짜가 지정된 경우 필터링 추가
            if (startDate != null) {
                query.and(PAYHISTORY.TRANSACTION_DATE.greaterOrEqual(startDate.atStartOfDay()));
            }
            if (endDate != null) {
                query.and(PAYHISTORY.TRANSACTION_DATE.lessThan(endDate.plusDays(1).atStartOfDay()));
            }

            // 4. payType이 지정된 경우 필터링 추가 ("SEND" 또는 "RECEIVE")
            if (payType != null && (payType.equals("SEND") || payType.equals("RECEIVE"))) {
                query.and(PAYHISTORY.TRANSACTION_TYPE.eq(payType));
            }

            // 5. 결과를 날짜순으로 정렬하여 반환
            return query.orderBy(PAYHISTORY.TRANSACTION_DATE.desc())
                    .fetchInto(PayHistory.class);
        }

        return null;
    }




    @Override
    public Account findPayAccountByUserId(Integer userId) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .and(ACCOUNT.BANK_CODE.eq("얼마페이"))
                .fetchOneInto(Account.class);
    }

}
