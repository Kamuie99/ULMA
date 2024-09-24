package com.ssafy11.domain.accounts;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record Transaction(
        @NotNull Integer transactionId,
        @NotNull Integer accountId,
        @NotNull Long amount,
        @NotNull LocalDateTime transactionDate,
        @NotNull Long balance,
        @NotNull String target
) {
}
