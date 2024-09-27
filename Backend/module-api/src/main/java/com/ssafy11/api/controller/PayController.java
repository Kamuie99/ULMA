package com.ssafy11.api.controller;

import com.ssafy11.api.service.PayService;
import com.ssafy11.domain.Account.Account;
import com.ssafy11.domain.Pay.ReceiveHistory;
import com.ssafy11.domain.Pay.SendHistory;
import com.ssafy11.domain.Pay.PayAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/{user_id}/pay")
public class PayController {

    private final PayService payService;

    // 1. Pay 계좌 만들기
    @PostMapping
    public ResponseEntity<Account> createPayAccount(
            @PathVariable("user_id") Integer userId) {
        Account createdPayAccount = payService.createPayAccount(userId);
        return ResponseEntity.ok(createdPayAccount);
    }

    // 2. Pay 내역 보기
    @GetMapping
    public ResponseEntity<List<SendHistory>> viewPayHistory(
            @PathVariable("user_id") Integer userId) {
        List<SendHistory> history = payService.viewPayHistory(userId);
        return ResponseEntity.ok(history);
    }

    // 3. Pay 잔액 보기
    @GetMapping("/balance")
    public ResponseEntity<Long> viewPayBalance(
            @PathVariable("user_id") Integer userId) {
        Long balance = payService.viewPayBalance(userId);
        return ResponseEntity.ok(balance);
    }

    // 4. Pay 충전하기
    @PostMapping("/balance")
    public ResponseEntity<ReceiveHistory> chargePayBalance(
            @PathVariable("user_id") Integer userId,
            @RequestBody Long amount) {
        ReceiveHistory receiveHistory = payService.chargePayBalance(userId, amount);
        return ResponseEntity.ok(receiveHistory);
    }

    // 5. Pay 송금하기
    @PostMapping("/send/pay")
    public ResponseEntity<SendHistory> sendPayMoney(
            @PathVariable("user_id") Integer userId,
            @RequestBody Integer accountId,
            @RequestBody String targetAccountNumber,
            @RequestBody Long amount) {
        SendHistory sendHistory = payService.sendPayMoney(userId, accountId, targetAccountNumber, amount);
        return ResponseEntity.ok(sendHistory);
    }
}
