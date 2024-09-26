package com.ssafy11.domain.Pay;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record Pay(
        @NotNull Integer id,
        @NotNull Integer accountId,
        @NotNull Integer userId,
        @NotNull Long amount,
        @NotNull Long leftBalance,
        @NotNull String target,
        @NotNull String info,
        @NotNull LocalDateTime transactionDate

) {
}
