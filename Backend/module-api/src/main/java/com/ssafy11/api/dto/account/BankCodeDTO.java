package com.ssafy11.api.dto.account;

import org.jetbrains.annotations.NotNull;

public record BankCodeDTO(
        @NotNull String bankCode
) {
}
