package com.ssafy11.domain.accounts;

import jakarta.validation.constraints.NotNull;

public record Pay(
        @NotNull Integer accountId,
        @NotNull String accountNumber,
        @NotNull Long balance
) {
}
