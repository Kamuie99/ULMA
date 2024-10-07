package com.ssafy11.api.dto.account;

import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;

public record SendPayMoneyRequest(
        @NotNull Long amount,
        @NotNull String targetAccountNumber,
        @NotNull String info
) {
}
