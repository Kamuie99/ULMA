package com.ssafy11.domain.accounts;

import jakarta.validation.constraints.NotNull;

public record CreateAccount(
        @NotNull Integer userId,
        @NotNull Long balance,
        @NotNull String bankCode
) {
}
