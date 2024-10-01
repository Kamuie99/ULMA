package com.ssafy11.api.dto.account;

import java.time.LocalDateTime;

public record SendPayMoneyRequest(
        Long amount,
        String targetAccountNumber,
        String info
) {
}
