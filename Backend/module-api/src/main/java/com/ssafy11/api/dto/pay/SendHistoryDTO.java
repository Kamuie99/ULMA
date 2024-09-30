package com.ssafy11.api.dto.pay;

import java.time.LocalDateTime;

public record SendHistoryDTO(
        Long amount,
        String targetAccountNumber,
        String info,
        LocalDateTime sendDate
) {}
