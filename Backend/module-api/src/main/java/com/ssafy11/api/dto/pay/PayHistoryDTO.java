package com.ssafy11.api.dto.pay;

import java.time.LocalDateTime;

public record PayHistoryDTO(
        Long amount,
        Long balanceAfterTransaction,
        String transactionType,
        String counterpartyName,
        String counterpartyAccountNumber,
        String description,
        LocalDateTime transactionDate
) {
}
