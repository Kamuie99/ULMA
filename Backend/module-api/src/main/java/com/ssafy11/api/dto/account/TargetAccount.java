package com.ssafy11.api.dto.account;

public record TargetAccount(
        String userName,
        String bankCode,
        String accountNumber
) {
}
