package com.ssafy11.domain.Pay;

import java.time.LocalDateTime;

public record PayHistory(
        Integer id,
        Integer accountId,
        Long amount,
        Long balanceAfterTransaction,
        String transactionType, // "SEND" 또는 "RECEIVE"
        String counterpartyName,
        String counterpartyAccountNumber,
        String description,
        LocalDateTime transactionDate
) {
}
