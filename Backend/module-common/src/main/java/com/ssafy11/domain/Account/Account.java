package com.ssafy11.domain.Account;

import jakarta.validation.constraints.NotNull;

public record Account(
        @NotNull Integer id,
        @NotNull Integer userId,
        @NotNull String accountNumber,
        @NotNull Long balance,
        @NotNull String bankCode
) {
}
