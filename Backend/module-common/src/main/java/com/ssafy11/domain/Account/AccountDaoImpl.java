package com.ssafy11.domain.Account;

import com.ssafy11.domain.Pay.PayHistory;
import com.ssafy11.domain.Pay.PayType;
import com.ssafy11.domain.users.Users;
import com.ssafy11.ulma.generated.tables.records.AccountRecord;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.SelectConditionStep;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import static com.ssafy11.ulma.generated.Tables.PAYHISTORY;
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
        return uuidNumeric.substring(0, 6) + "-" + uuidNumeric.substring(6, 8) + "-" + uuidNumeric.substring(8, 14);
    }


    @Override
    public Account connectAccount(Integer userId, String bankCode, String accountNumber) {
        Account account = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .and(ACCOUNT.BANK_CODE.eq(bankCode))
                .fetchOneInto(Account.class);

        if (account == null) {
            return null;
        }

        dsl.update(USERS)
                .set(USERS.ACCOUNT_NUMBER, accountNumber)
                .execute();

        return account;
    }

    @Override
    public List<Account> findAllAccounts(Integer userId, String bankCode) {
        if (bankCode != null) {
            return dsl.selectFrom(ACCOUNT)
                    .where(ACCOUNT.USER_ID.eq(userId))
                    .and(ACCOUNT.BANK_CODE.eq(bankCode))
                    .fetchInto(Account.class);
        } else {
            return dsl.selectFrom(ACCOUNT)
                    .where(ACCOUNT.USER_ID.eq(userId))
                    .and(ACCOUNT.BANK_CODE.notEqual("얼마페이"))
                    .fetchInto(Account.class);
        }
    }

    @Override
    public Account connectedAccount(Integer userId) {
        Users user = dsl.selectFrom(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(Users.class);

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

    @Override
    public PayHistory chargeBalance(String accountNumber, Long amount) {
        // 계좌를 조회 (계좌번호로 찾음)
        Account account = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .fetchOneInto(Account.class);
        // 계좌가 존재하고 유효한 경우
        if (account != null) {
            // 1. 계좌에 잔액 충전
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.add(amount))
                    .where(ACCOUNT.ID.eq(account.id()))
                    .execute();
            // 2. PayHistory 생성 (ATM 충전 기록)
            PayHistory receiveHistory = createReceiveHistory(
                    accountNumber,
                    amount,
                    "ATM",
                    "ATM"
            );
            return receiveHistory;
        }

        return null;
    }


    @Override
    public PayHistory sendMoney(String senderAccountNumber, String info, String targetAccountNumber, Long amount) {
        // 1. 보내는 사람의 계좌를 조회
        Account senderAccount = this.findByAccountNumber(senderAccountNumber);
        // 2. 받는 사람의 계좌를 조회
        Account targetAccount = this.findByAccountNumber(targetAccountNumber);

        // 3. 송금 대상 사용자의 이름을 조회
        String targetUserName = dsl.select(USERS.NAME)
                .from(USERS)
                .where(USERS.ID.eq(targetAccount.userId()))
                .fetchOneInto(String.class);

        // 4. 보내는 사람의 이름을 조회
        String senderUserName = dsl.select(USERS.NAME)
                .from(USERS)
                .where(USERS.ID.eq(senderAccount.userId()))
                .fetchOneInto(String.class);

        // 5. 송금 처리
        if (senderAccount != null && targetAccount != null && senderAccount.balance() >= amount) {
            // 6. 보내는 사람의 계좌에서 잔액 차감
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.subtract(amount))
                    .where(ACCOUNT.ID.eq(senderAccount.id()))
                    .execute();

            // 7. 받는 사람의 계좌에 잔액 추가
            dsl.update(ACCOUNT)
                    .set(ACCOUNT.BALANCE, ACCOUNT.BALANCE.add(amount))
                    .where(ACCOUNT.ID.eq(targetAccount.id()))
                    .execute();

            // 8. 송금 내역(PayHistory) 생성
            PayHistory sendHistory = createSendHistory(
                    senderAccount.accountNumber(),
                    amount,
                    targetUserName,
                    targetAccountNumber,
                    info
            );

            // 9. 수신 내역(PayHistory) 생성
            createReceiveHistory(
                    targetAccount.accountNumber(),
                    amount,
                    senderUserName,
                    senderAccount.accountNumber()
            );

            return sendHistory;
        }

        return null;
    }

    public PayHistory createSendHistory(String accountNumber, Long amount, String target, String targetAccountNumber, String info) {
        Account sendAccount = this.findByAccountNumber(accountNumber);

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
        Account receiveAccount = this.findByAccountNumber(accountNumber);
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
    public PaginatedHistory findPayHistory(String accountNumber,
                                           LocalDate startDate,
                                           LocalDate endDate,
                                           String payType,
                                           int page,
                                           int size) {
        // 1. 계좌번호로 계좌 조회
        Account account = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .fetchOneInto(Account.class);

        // 2. 해당 계좌의 PayHistory 내역 조회
        if (account != null) {
            Integer count = dsl.selectCount()
                    .from(PAYHISTORY)
                    .where(PAYHISTORY.ACCOUNT_ID.eq(account.id()))
                    .fetchOne(0, int.class);


            int totalItemsCount = (count != null) ? count : 0;
            int totalPages = (int) Math.ceil((double) totalItemsCount/size);

            var query = dsl.selectFrom(PAYHISTORY)
                    .where(PAYHISTORY.ACCOUNT_ID.eq(account.id()));

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

            // 페이지네이션 적용
            List<PayHistory> payHistories = query.orderBy(PAYHISTORY.TRANSACTION_DATE.desc())
                    .limit(size)
                    .offset(page * size)
                    .fetchInto(PayHistory.class);

            // 5. 결과를 날짜순으로 정렬하여 반환
            return new PaginatedHistory(payHistories, page, totalItemsCount, totalPages);
        }

        return new PaginatedHistory(List.of(), 0, 0, 0);
    }

    @Override
    public String verifyMyAccount(Integer userId, String bankCode, String accountNumber) {
        Account account = dsl.selectFrom(ACCOUNT)
                .where(ACCOUNT.ACCOUNT_NUMBER.eq(accountNumber))
                .and(ACCOUNT.BANK_CODE.eq(bankCode))
                .fetchOneInto(Account.class);

        if (account == null) {
            return null;
        }

        if (account.userId() != userId) {
            return "유저 불일치";
        }

        Random random = new Random();
        int number = random.nextInt(1000);
        String num = String.format("%03d", number);

        PayHistory receiveHistory = this.createReceiveHistory(accountNumber, 1L, num, "얼마페이 인증");


        return num;
    }

}
