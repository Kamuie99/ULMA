package com.ssafy11.domain.Pay;

import java.time.LocalDateTime;

public record SendHistory(
        Integer id,
        Integer accountId,
        Long amount,
        Long leftBalance,
        String target,
        String targetAccountNumber,
        String info,
        LocalDateTime transactionDate
) {}
