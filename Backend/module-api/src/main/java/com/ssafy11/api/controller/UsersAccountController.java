package com.ssafy11.api.controller;

import com.ssafy11.domain.accounts.Account;
import com.ssafy11.domain.accounts.AccountDao;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/{user_id}/account")
public class UsersAccountController {

    private final AccountDao accountDao;

    @GetMapping("/")
    public ResponseEntity<List<Account>> getMyAccounts(@PathVariable("user_id") Integer userId) {
        return ResponseEntity.ok(accountDao.findByUserId(userId));
    }

    @PostMapping("/")
    public ResponseEntity<Account> connectAccount(@PathVariable("user_id") Integer userId, String accountNumber) {
        return ResponseEntity.ok(accountDao.chooseAccount(userId, accountNumber));
    }

    @GetMapping("/info")
    public ResponseEntity<Account> getConnectedAccount(@PathVariable("user_id") Integer userId) {
        return ResponseEntity.ok(accountDao.getConnectedAccount(userId));
    }

    @DeleteMapping("/info")
    public ResponseEntity<Boolean> deleteConnectedAccount(@PathVariable("user_id") Integer userId) {
        return ResponseEntity.ok(accountDao.deleteConnectedAccount(userId));
    }
}
