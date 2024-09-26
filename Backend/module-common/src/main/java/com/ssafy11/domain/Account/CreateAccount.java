package com.ssafy11.domain.Account;

import jakarta.validation.constraints.NotNull;

public record CreateAccount(
    @NotNull Integer userId,
    @NotNull String bankCode,
    @NotNull String accountNumber
) {
}
