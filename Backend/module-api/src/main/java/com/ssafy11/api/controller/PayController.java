package com.ssafy11.api.controller;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.account.ChargePayAmountRequest;
import com.ssafy11.api.dto.account.ChargePayAmountResponse;
import com.ssafy11.api.dto.account.SendPayMoneyRequest;
import com.ssafy11.api.dto.pay.PayHistoryDTO;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.api.service.PayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/pay")
public class PayController {

    private final PayService payService;

    // 1. Pay 계좌 만들기
    @PostMapping
    public ResponseEntity<AccountDTO> createPayAccount(
            @AuthenticationPrincipal User user) {
        Assert.notNull(user, "User must not be null");
        int authenticatedUserId = Integer.parseInt(user.getUsername());
        AccountDTO createdPayAccount = payService.createPayAccount(authenticatedUserId);
        return ResponseEntity.ok(createdPayAccount);
    }

    // 2. Pay 내역 보기
    @GetMapping
    public ResponseEntity<List<PayHistoryDTO>> viewPayHistory(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "start_date", required = false) String startDate,  // 시작 날짜 (optional)
            @RequestParam(value = "end_date", required = false) String endDate,    // 종료 날짜 (optional)
            @RequestParam(value = "pay_type", required = false) String payType     // SEND 또는 RECEIVE (optional)
    ) {
        Assert.notNull(user, "User must not be null");
        // 문자열 날짜를 LocalDate로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startLocalDate = null;
        LocalDate endLocalDate = null;

        try {
            if (startDate != null) {
                startLocalDate = LocalDate.parse(startDate, formatter);
            }
            if (endDate != null) {
                endLocalDate = LocalDate.parse(endDate, formatter);
            }
        } catch (DateTimeParseException e) {
            // 예외 처리: 날짜 형식이 잘못된 경우 에러 응답
            return ResponseEntity.badRequest().body(null);
        }

        int authenticatedUserId = Integer.parseInt(user.getUsername());
        List<PayHistoryDTO> history = payService.viewPayHistory(authenticatedUserId, startLocalDate, endLocalDate, payType);
        return ResponseEntity.ok(history);
    }

    // 3. Pay 잔액 보기
    @GetMapping("/balance")
    public ResponseEntity<ChargePayAmountResponse> viewPayBalance(
            @AuthenticationPrincipal User user) {
        Assert.notNull(user, "User must not be null");
        int authenticatedUserId = Integer.parseInt(user.getUsername());
        try {
            ChargePayAmountResponse balance = payService.viewPayBalance(authenticatedUserId);
            return ResponseEntity.ok(balance);
        } catch (ErrorException e) {
            throw e;
        }
    }

    // 4. Pay 충전하기
    @PostMapping("/balance")
    public ResponseEntity<PayHistoryDTO> chargePayBalance(
            @AuthenticationPrincipal User user,
            @RequestBody ChargePayAmountRequest request) {
        Assert.notNull(user, "User must not be null");
        Assert.notNull(request, "ChargePayAmount must not be null");
        int authenticatedUserId = Integer.parseInt(user.getUsername());
        PayHistoryDTO receiveHistory = payService.chargePayBalance(authenticatedUserId, request.amount());
        return ResponseEntity.ok(receiveHistory);
    }

    // 5. Pay 송금하기
    @PostMapping("/send")
    public ResponseEntity<PayHistoryDTO> sendPayMoney(
            @AuthenticationPrincipal User user,
            @RequestBody SendPayMoneyRequest request) {
        Assert.notNull(user, "User must not be null");
        Assert.notNull(request, "SendPayMoney must not be null");
        int authenticatedUserId = Integer.parseInt(user.getUsername());
        PayHistoryDTO sendHistory = payService.sendPayMoney(authenticatedUserId, request.info(), request.targetAccountNumber(), request.amount());
        return ResponseEntity.ok(sendHistory);
    }
}
