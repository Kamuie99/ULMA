package com.ssafy11.api.dto.pay;

import java.time.LocalDateTime;

public record ReceiveHistoryDTO(
        Long amount,
        String senderAccountNumber,
        String info,
        LocalDateTime receiveDate
) {}
