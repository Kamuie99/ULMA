package com.ssafy11.domain.accounts;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateTransaction(
        @NotNull Integer transactionId,
        @NotNull Integer accountId,
        @NotNull Long amount,
        @NotNull Long balance,
        @NotNull String target,
        @NotNull String info
) {
}
