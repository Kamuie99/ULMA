package com.ssafy11.api.controller;

import com.ssafy11.api.service.AccountService;
import com.ssafy11.domain.accounts.Account;
import com.ssafy11.domain.accounts.CreateAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/{user_id}/account")
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@PathVariable("user_id") Integer userId, @RequestBody CreateAccount account) {
        return ResponseEntity.ok(accountService.createAccount(userId, account));
    }

}
