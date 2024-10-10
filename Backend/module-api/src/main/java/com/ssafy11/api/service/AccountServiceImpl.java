package com.ssafy11.api.service;

import com.ssafy11.api.dto.account.TargetAccount;
import com.ssafy11.api.dto.account.VerifyNumber;
import com.ssafy11.api.dto.pay.PayHistoryDTO;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Account.AccountDao;
import com.ssafy11.domain.Account.PaginatedHistory;
import com.ssafy11.domain.Pay.PayHistory;
import com.ssafy11.domain.Pay.PayType;
import com.ssafy11.domain.users.UserDaoImpl;
import com.ssafy11.domain.users.dto.UserInfoRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {
    private final AccountDao accountDao;
    private final UserDaoImpl userDao;

    @Override
    @Transactional
    public Account createAccount(Integer userId, String bankCode) {
        return accountDao.createAccount(userId, bankCode);
    }

    @Override
    @Transactional
    public Account connectAccount(Integer userId, String bankCode, String accountNumber) {
        Account account = accountDao.connectAccount(userId, bankCode, accountNumber);

        if (account == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        return account;
    }

    @Override
    public List<Account> findAllAccounts(Integer userId, String bankCode) {
        List<Account> allAccounts = accountDao.findAllAccounts(userId, bankCode);
        if (allAccounts == null || allAccounts.isEmpty()) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        return accountDao.findAllAccounts(userId, bankCode);
    }

    @Override
    public Account connectedAccount(Integer userId) {
        Account account = accountDao.connectedAccount(userId);
        if (account == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND, "등록된 계좌가 없습니다.");
        }
        return account;
    }

    @Override
    public Account findByAccountNumber(String accountNumber) {
        return accountDao.findByAccountNumber(accountNumber);
    }

    @Override
    public Account findByAccountId(Integer accountId) {
        return accountDao.findByAccountId(accountId);
    }

    @Override
    @Transactional
    public PayHistoryDTO chargeBalance(String accountNumber, Long amount) {
        if (amount < 0) {
            throw new ErrorException(ErrorCode.NEGATIVE_VALUE_NOT_ALLOWED);
        }

        PayHistory payHistory = accountDao.chargeBalance(accountNumber, amount);

        if (payHistory == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        // PayHistory 엔티티를 PayHistoryDTO로 변환
        return new PayHistoryDTO(
                payHistory.amount(),
                payHistory.balanceAfterTransaction(),
                payHistory.transactionType(),
                payHistory.counterpartyName(),
                payHistory.counterpartyAccountNumber(),
                payHistory.description(),
                payHistory.transactionDate()
        );
    }


    @Override
    @Transactional
    public PayHistoryDTO sendMoney(String senderAccountNumber, String info, String targetAccountNumber, Long amount) {

        if (amount <= 0) {
            throw new ErrorException(ErrorCode.NEGATIVE_VALUE_NOT_ALLOWED);
        }
        PayHistory payHistory = accountDao.sendMoney(senderAccountNumber, info, targetAccountNumber, amount);

        if (payHistory == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        return convertToDTO(payHistory);
    }

    @Override
    public PaginatedHistory<PayHistory> findPayHistory(String accountNumber, LocalDate startDate, LocalDate endDate, String payType, Integer page, Integer size) {

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new ErrorException(ErrorCode.INVALID_DATE_RANGE);
        }


        if (payType != null) {
            try {
                PayType valid = PayType.valueOf(payType.toUpperCase());
                if (valid.equals(PayType.CHARGE)) {
                    throw new ErrorException(ErrorCode.BadRequest, "유효하지 않은 결제 유형입니다.");
                }
            } catch (IllegalArgumentException e) {
                throw new ErrorException(ErrorCode.BadRequest, "유효하지 않은 결제 유형입니다.");
            }
        }

        PaginatedHistory<PayHistory> paginatedHistory = accountDao.findPayHistory(accountNumber, startDate, endDate, payType, page, size);

        if (paginatedHistory == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        // PayHistory 데이터를 PayHistoryDTO로 변환
//        List<PayHistoryDTO> payHistoryDTOList = paginatedHistory.data().stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());

        // PayHistoryDTO 타입의 PaginatedHistory 반환
        return paginatedHistory;
    }




    // PayHistory 엔티티를 PayHistoryDTO로 변환하는 메서드
    private PayHistoryDTO convertToDTO(PayHistory payHistory) {
        return new PayHistoryDTO(
                payHistory.amount(),
                payHistory.balanceAfterTransaction(),
                payHistory.transactionType(),
                payHistory.counterpartyName(),
                payHistory.counterpartyAccountNumber(),
                payHistory.description(),
                payHistory.transactionDate()
        );
    }

    @Override
    @Transactional
    public VerifyNumber verifyMyAccount(Integer userId, String bankCode, String accountNumber) {
        String result = accountDao.verifyMyAccount(userId, bankCode, accountNumber);

        if (result == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND);
        } else if (result.equals("유저 불일치")) {
            throw new ErrorException(ErrorCode.USER_MISSMATCH);
        }

        return new VerifyNumber(result);
    }

    @Override
    public TargetAccount verifyTargetAccount(String bankCode, String accountNumber) {
        Account account = accountDao.verifyTargetAccount(bankCode, accountNumber);
        if (account == null) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND, "계좌를 다시 확인하여 주십시오.");
        }
        Optional<UserInfoRequest> user = userDao.getUserInfo(account.userId());

        if (user.isEmpty()) {
            throw new ErrorException(ErrorCode.ACCOUNT_NOT_FOUND, "계좌를 다시 확인하여 주십시오.");
        }


        return new TargetAccount(
                user.get().name(),
                bankCode,
                accountNumber
        );
    }
}
