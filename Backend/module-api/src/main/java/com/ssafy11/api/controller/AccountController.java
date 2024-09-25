package com.ssafy11.api.controller;

import com.ssafy11.api.service.AccountService;
import com.ssafy11.domain.accounts.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(Account account) {
        return ResponseEntity.ok(accountService.createAccount(account));
    }
}
