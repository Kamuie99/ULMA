package com.ssafy11.domain.Pay;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record PayAccount(
        @NotNull String accountNumber,
        @NotNull Long balance
) {
}
