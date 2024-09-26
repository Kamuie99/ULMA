package com.ssafy11.api.controller;

import com.ssafy11.api.service.PayService;
import com.ssafy11.domain.accounts.Account;
import com.ssafy11.domain.accounts.CreateTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/{user_id}/pay")
public class PayController {

    private final PayService payService;

    @PostMapping("/")
    public ResponseEntity<Account> createPay(@PathVariable("user_id") Integer userId) {
        return ResponseEntity.ok(payService.createPay(userId));
    }

    @GetMapping("/")
    public ResponseEntity<Account> getPayDetails(@PathVariable("user_id") Integer userId) {
        return ResponseEntity.ok(payService.getPay(userId));
    }

    @GetMapping("/balance")
    public ResponseEntity<Account> getPayBalance(@PathVariable("user_id") Integer userId) {
        return ResponseEntity.ok(payService.getPay(userId));
    }

    @PostMapping("/balance")
    public ResponseEntity<Account> rechargePay(@PathVariable("user_id") Integer userId, @RequestParam Long amount,  CreateTransaction transaction) {
        payService.changeCharge(userId, amount, transaction);
        return ResponseEntity.ok(payService.getPay(userId));
    }

    @PostMapping("/send")
    public ResponseEntity<Account> sendPay(
            @PathVariable("user_id") Integer userId,
            @RequestBody Long amount,
            CreateTransaction transaction) {
        payService.changeCharge(userId, amount, transaction);
        return ResponseEntity.ok(payService.getPay(userId));
    }
}
