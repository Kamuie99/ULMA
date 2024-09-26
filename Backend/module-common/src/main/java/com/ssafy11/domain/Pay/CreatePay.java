package com.ssafy11.domain.Pay;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreatePay(
        @NotNull Integer accountId,
        @NotNull Integer userId,
        @NotNull Long amount,
        @NotNull Long leftBalance,
        @NotNull String target,
        @NotNull String info
){
}
