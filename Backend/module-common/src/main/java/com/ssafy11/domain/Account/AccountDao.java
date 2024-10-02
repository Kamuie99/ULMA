package com.ssafy11.domain.Account;

import com.ssafy11.domain.Pay.PayHistory;

import java.time.LocalDate;
import java.util.List;

public interface AccountDao {
    Account createAccount(Integer userId, String bankCode);  // BankCode -> String

    Account connectAccount(Integer userid, String accountNumber);

    List<Account> findAllAccounts(Integer userId, String bankCode);  // BankCode -> String

    Account connectedAccount(Integer userId);

    Account findByAccountNumber(String accountNumber);

    Account findByAccountId(Integer accountId);

    PayHistory sendMoney(String senderAccountNumber, String info, String targetAccountNumber, Long amount);
    PayHistory chargeBalance(String accountNumber, Long amount);
    PaginatedHistory findPayHistory(String accountNumber, LocalDate startDate, LocalDate endDate, String payType, int page, int size);
}
