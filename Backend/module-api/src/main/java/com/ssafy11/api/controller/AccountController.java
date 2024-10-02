package com.ssafy11.api.controller;

import com.ssafy11.api.dto.account.AccountNumberRequest;
import com.ssafy11.api.dto.account.BankCodeDTO;
import com.ssafy11.api.dto.account.ChargePayAmountRequest;
import com.ssafy11.api.dto.account.SendPayMoneyRequest;
import com.ssafy11.api.service.AccountService;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.PayHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AccountController {

    private final AccountService accountService;

    // 1. 계좌 만들기
    @PostMapping("/{user_id}/account")
    public ResponseEntity<Account> createAccount(
            @PathVariable("user_id") Integer userId,
            @RequestBody BankCodeDTO bankCodeDTO) {  // BankCodeDTO로 변경
        String bankCode = bankCodeDTO.getBankCode();  // bankCode 값 추출
        Account createdAccount = accountService.createAccount(userId, bankCode);
        return ResponseEntity.ok(createdAccount);
    }


    // 2. 내 계좌 등록하기
    @PostMapping("/users/{user_id}/account")
    public ResponseEntity<Account> registerAccount(
            @PathVariable("user_id") Integer userId,
            @RequestBody AccountNumberRequest accountNumber) {
        Account registeredAccount = accountService.connectAccount(userId, accountNumber.accountNumber());
        return ResponseEntity.ok(registeredAccount);
    }

    // 3. 내 계좌 보기
    @GetMapping("/users/{user_id}/account")
    public ResponseEntity<List<Account>> viewAccounts(
            @PathVariable("user_id") Integer userId,
            @RequestParam(value = "bankCode", required = false) String bankCode) {  // BankCode -> String
        List<Account> accounts = accountService.findAllAccounts(userId, bankCode);
        return ResponseEntity.ok(accounts);
    }

    // 4. 연결 계좌 정보 보기
    @GetMapping("/users/{user_id}/account/info")
    public ResponseEntity<Account> viewConnectedAccountInfo(
            @PathVariable("user_id") Integer userId) {
        Account connectedAccount = accountService.connectedAccount(userId);
        return ResponseEntity.ok(connectedAccount);
    }

    // 5. 계좌 잔액 충전
    @PostMapping("/account/{account_number}/charge")
    public ResponseEntity<PayHistory> chargeBalance(
            @PathVariable("account_number") String accountNumber,
            @RequestBody ChargePayAmountRequest request) {
        PayHistory payHistory = accountService.chargeBalance(accountNumber, request.amount());
        return ResponseEntity.ok(payHistory);
    }

    // 6. 송금하기
    @PostMapping("/account/{sender_account_number}/send")
    public ResponseEntity<PayHistory> sendMoney(
            @PathVariable("sender_account_number") String senderAccountNumber,
            @RequestBody SendPayMoneyRequest request) {
        PayHistory payHistory = accountService.sendMoney(senderAccountNumber, request.info(), request.targetAccountNumber(), request.amount());
        return ResponseEntity.ok(payHistory);
    }

    // 7. 거래 내역 조회
    @GetMapping("/account/{account_number}/history")
    public ResponseEntity<List<PayHistory>> getPayHistory(
            @PathVariable("account_number") String accountNumber,
            @RequestParam(value = "start_date", required = false) LocalDate startDate,
            @RequestParam(value = "end_date", required = false) LocalDate endDate,
            @RequestParam(value = "pay_type", required = false) String payType) {
        List<PayHistory> payHistoryList = accountService.findPayHistory(accountNumber, startDate, endDate, payType);
        return ResponseEntity.ok(payHistoryList);
    }

}
