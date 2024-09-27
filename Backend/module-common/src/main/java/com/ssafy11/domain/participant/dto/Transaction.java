package com.ssafy11.domain.participant.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record Transaction(//사용자와 게스트의 거래내역
                          Integer guestId,
                          String Name,
                          LocalDateTime date,
                          Integer amount
) { }
