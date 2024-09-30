package com.ssafy11.api.controller;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.pay.ReceiveHistoryDTO;
import com.ssafy11.api.dto.pay.SendHistoryDTO;
import com.ssafy11.api.service.PayService;
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
    public ResponseEntity<AccountDTO> createPayAccount(
            @PathVariable("user_id") Integer userId) {
        AccountDTO createdPayAccount = payService.createPayAccount(userId);
        return ResponseEntity.ok(createdPayAccount);
    }

    // 2. Pay 내역 보기
    @GetMapping
    public ResponseEntity<List<SendHistoryDTO>> viewPayHistory(
            @PathVariable("user_id") Integer userId) {
        List<SendHistoryDTO> history = payService.viewPayHistory(userId);
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
    public ResponseEntity<ReceiveHistoryDTO> chargePayBalance(
            @PathVariable("user_id") Integer userId,
            @RequestBody Long amount) {
        ReceiveHistoryDTO receiveHistory = payService.chargePayBalance(userId, amount);
        return ResponseEntity.ok(receiveHistory);
    }

    // 5. Pay 송금하기
    @PostMapping("/send/pay")
    public ResponseEntity<SendHistoryDTO> sendPayMoney(
            @PathVariable("user_id") Integer userId,
            @RequestBody Integer accountId,
            @RequestBody String targetAccountNumber,
            @RequestBody Long amount) {
        SendHistoryDTO sendHistory = payService.sendPayMoney(userId, targetAccountNumber, amount);
        return ResponseEntity.ok(sendHistory);
    }
}
