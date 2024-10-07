package com.ssafy11.api.dto.account;

import org.jetbrains.annotations.NotNull;

public record AccountConnectRequest(
        @NotNull String bankCode,
        @NotNull String accountNumber) {
}
