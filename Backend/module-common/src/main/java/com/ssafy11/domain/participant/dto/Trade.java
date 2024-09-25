package com.ssafy11.domain.participant.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record Trade(//사용자와 게스트의 거래내역
                    Integer guestId,
                    Integer eventId,
                    String eventName,
                    LocalDateTime date,
                    Integer amount
) { }
