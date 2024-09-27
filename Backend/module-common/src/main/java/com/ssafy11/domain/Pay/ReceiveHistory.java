package com.ssafy11.domain.Pay;

import java.time.LocalDateTime;

public record ReceiveHistory(
        Integer id,
        Integer accountId,
        Long amount,
        Long leftBalance,
        String sender,
        String senderAccountNumber,
        String info,
        LocalDateTime transactionDate
) {}
