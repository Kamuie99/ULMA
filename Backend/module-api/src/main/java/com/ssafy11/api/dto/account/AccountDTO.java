package com.ssafy11.api.dto.account;

public record AccountDTO(
        String accountNumber,
        Long balance,
        String bankCode
) {}
