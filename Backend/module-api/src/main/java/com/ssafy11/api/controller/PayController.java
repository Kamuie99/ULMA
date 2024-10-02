package com.ssafy11.api.controller;

import com.ssafy11.api.dto.account.AccountDTO;
import com.ssafy11.api.dto.account.ChargePayAmountRequest;
import com.ssafy11.api.dto.account.SendPayMoneyRequest;
import com.ssafy11.api.dto.pay.PayHistoryDTO;
import com.ssafy11.api.service.PayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
    public ResponseEntity<List<PayHistoryDTO>> viewPayHistory(
            @PathVariable("user_id") Integer userId,
            @RequestParam(required = false) String startDate,  // 시작 날짜 (optional)
            @RequestParam(required = false) String endDate,    // 종료 날짜 (optional)
            @RequestParam(required = false) String payType     // SEND 또는 RECEIVE (optional)
    ) {
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

        List<PayHistoryDTO> history = payService.viewPayHistory(userId, startLocalDate, endLocalDate, payType);
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
    public ResponseEntity<PayHistoryDTO> chargePayBalance(
            @PathVariable("user_id") Integer userId,
            @RequestBody ChargePayAmountRequest request) {
        PayHistoryDTO receiveHistory = payService.chargePayBalance(userId, request.amount());
        return ResponseEntity.ok(receiveHistory);
    }

    // 5. Pay 송금하기
    @PostMapping("/send")
    public ResponseEntity<PayHistoryDTO> sendPayMoney(
            @PathVariable("user_id") Integer userId,
            @RequestBody SendPayMoneyRequest request) {
        PayHistoryDTO sendHistory = payService.sendPayMoney(userId, request.info(), request.targetAccountNumber(), request.amount());
        return ResponseEntity.ok(sendHistory);
    }
}
