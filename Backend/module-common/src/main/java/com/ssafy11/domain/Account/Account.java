package com.ssafy11.domain.Account;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record Account(
        @NotNull Integer id,
        @NotNull Integer userId,
        @NotNull String accountNumber,
        @NotNull Long balance,
        @NotNull String bankCode,
        @NotNull LocalDateTime createdAt
) {
}
