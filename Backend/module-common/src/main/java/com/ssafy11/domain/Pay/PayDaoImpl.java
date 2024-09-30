package com.ssafy11.domain.Pay;

import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.AccountDao;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import static com.ssafy11.ulma.generated.Tables.USERS;
import static com.ssafy11.ulma.generated.tables.Account.ACCOUNT;
import static com.ssafy11.ulma.generated.tables.Receivehistory.RECEIVEHISTORY;
import static com.ssafy11.ulma.generated.tables.Sendhistory.SENDHISTORY;

@RequiredArgsConstructor
@Repository
public class PayDaoImpl implements PayDao {

    private final DSLContext dsl;
    private final AccountDao accountDao;

    @Override
    public Account createPayAccount(Integer userId) {
        String accountNumber = generateAccountNumber();
        int accountId = dsl.insertInto(ACCOUNT)
                .set(ACCOUNT.USER_ID, userId)
                .set(ACCOUNT.ACCOUNT_NUMBER, accountNumber)
                .set(ACCOUNT.BANK_CODE, "얼마페이")
                .execute();

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

    @Override
    public ReceiveHistory chargeBalance(Integer accountId, Long amount) {
        Account account = accountDao.findByAccountId(accountId);

        if (account != null) {
            // 계좌 잔액을 증가
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.add(amount))
                    .where(ACCOUNT.ID.eq(accountId))
                    .execute();

            // ReceiveHistory 생성
            return createReceiveHistory(account.accountNumber(), amount, "잔액 충전", "내 계좌", "잔액 충전");
        }

        return null;
    }

    @Override
    public SendHistory sendMoney(Integer accountId, String target, String targetAccountNumber, Long amount, String info) {
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

            // 3. 송금 내역 생성
            SendHistory sendHistory = createSendHistory(sendAccount.accountNumber(), amount, target, targetAccountNumber, info);

            // 4. 받는 사람의 수신 내역 생성
            createReceiveHistory(targetAccount.accountNumber(), amount, sendAccount.accountNumber(), sendAccount.accountNumber(), info);

            return sendHistory;
        }

        return null;
    }


    @Override
    public ReceiveHistory chargePayBalance(Integer userId, Long amount) {
        // users 테이블에서 account_number를 가져옴
        String userAccountNumber = dsl.select(USERS.ACCOUNT_NUMBER)
                .from(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(String.class);

        // account 테이블에서 사용자의 account_number를 가진 원래 계좌를 찾음
        Account connectedAccount = accountDao.findByAccountNumber(userAccountNumber);

        // 사용자의 얼마페이 계좌를 조회
        Account payAccount = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .and(ACCOUNT.BANK_CODE.eq("얼마페이"))  // 얼마페이 계좌
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

            // 3. 원래 계좌에서 송금 내역(SendHistory) 생성
            SendHistory sendHistory = createSendHistory(
                    connectedAccount.accountNumber(),
                    amount,
                    "얼마페이",
                    payAccount.accountNumber(),
                    "얼마페이 충전"
            );

            // 4. 얼마페이 계좌에서 수신 내역(ReceiveHistory) 생성
            createReceiveHistory(
                    payAccount.accountNumber(),
                    amount,
                    connectedAccount.accountNumber(),
                    connectedAccount.accountNumber(),
                    "얼마페이 충전"
            );

            return dsl.selectFrom(RECEIVEHISTORY)
                    .where(RECEIVEHISTORY.ACCOUNT_ID.eq(payAccount.id()))
                    .orderBy(RECEIVEHISTORY.ID.desc())  // 마지막 충전 내역 반환
                    .fetchOneInto(ReceiveHistory.class);
        }

        return null;
    }


    @Override
    public SendHistory sendPayMoney(Integer userId, String targetAccountNumber, Long amount) {
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

            // 8. 송금 내역(SendHistory) 생성, 송금 대상과 보내는 사람의 이름 사용
            SendHistory sendHistory = createSendHistory(
                    payAccount.accountNumber(),
                    amount,
                    targetUserName,
                    targetAccountNumber,
                    "얼마페이 송금 완료"
            );

            // 9. 수신 내역(ReceiveHistory) 생성, 보내는 사람의 이름 사용
            createReceiveHistory(
                    targetAccount.accountNumber(),
                    amount,
                    senderUserName,
                    payAccount.accountNumber(),
                    "얼마페이 송금 수신"
            );

            return sendHistory;
        }
        return null;
    }




    @Override
    public SendHistory createSendHistory(String accountNumber, Long amount, String target, String targetAccountNumber, String info) {
        Account sendAccount = accountDao.findByAccountNumber(accountNumber);

        if (sendAccount != null) {
            // SendHistory 생성
            int sendId = dsl.insertInto(SENDHISTORY)
                    .set(SENDHISTORY.ACCOUNT_ID, sendAccount.id())
                    .set(SENDHISTORY.AMOUNT, amount)
                    .set(SENDHISTORY.LEFT_BALANCE, sendAccount.balance() - amount)
                    .set(SENDHISTORY.TARGET, target)
                    .set(SENDHISTORY.TARGET_ACCOUNT_NUMBER, targetAccountNumber)
                    .set(SENDHISTORY.INFO, info)
                    .returning(SENDHISTORY.ID)
                    .fetchOne()
                    .getValue(SENDHISTORY.ID);

            // 자동으로 receiveHistory 생성
            createReceiveHistory(targetAccountNumber, amount, sendAccount.accountNumber(), sendAccount.accountNumber(), info);

            return dsl.selectFrom(SENDHISTORY)
                    .where(SENDHISTORY.ID.eq(sendId))
                    .fetchOneInto(SendHistory.class);
        }
        return null;
    }

    @Override
    public ReceiveHistory createReceiveHistory(String accountNumber, Long amount, String sender, String senderAccountNumber, String info) {
        Account receiveAccount = accountDao.findByAccountNumber(accountNumber);

        if (receiveAccount != null) {
            int receiveId = dsl.insertInto(RECEIVEHISTORY)
                    .set(RECEIVEHISTORY.ACCOUNT_ID, receiveAccount.id())
                    .set(RECEIVEHISTORY.AMOUNT, amount)
                    .set(RECEIVEHISTORY.LEFT_BALANCE, receiveAccount.balance() + amount)
                    .set(RECEIVEHISTORY.SENDER, sender)
                    .set(RECEIVEHISTORY.SENDER_ACCOUNT_NUMBER, senderAccountNumber)
                    .set(RECEIVEHISTORY.INFO, info)
                    .returning(RECEIVEHISTORY.ID)
                    .fetchOne()
                    .getValue(RECEIVEHISTORY.ID);

            return dsl.selectFrom(RECEIVEHISTORY)
                    .where(RECEIVEHISTORY.ID.eq(receiveId))
                    .fetchOneInto(ReceiveHistory.class);
        }
        return null;
    }
    @Override
    public List<SendHistory> findSendHistoryByUserId(Integer userId) {
        return dsl.selectFrom(SENDHISTORY)
                .where(SENDHISTORY.ACCOUNT_ID.in(
                        dsl.select(ACCOUNT.ID)
                                .from(ACCOUNT)
                                .where(ACCOUNT.USER_ID.eq(userId))
                                .and(ACCOUNT.BANK_CODE.eq("얼마페이"))))
                .fetchInto(SendHistory.class);
    }

    @Override
    public Account findPayAccountByUserId(Integer userId) {
        return dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.USER_ID.eq(userId))
                .and(ACCOUNT.BANK_CODE.eq("얼마페이"))
                .fetchOneInto(Account.class);
    }

}
