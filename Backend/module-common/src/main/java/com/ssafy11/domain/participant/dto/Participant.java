package com.ssafy11.domain.participant.dto;

import lombok.Builder;

@Builder
public record Participant(
        Integer eventId,
        Integer guestId,
        Integer amount
) {

}
