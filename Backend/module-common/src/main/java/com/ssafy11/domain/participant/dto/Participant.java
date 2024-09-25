package com.ssafy11.domain.participant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
public record Participant(
        Integer eventId,
        Integer guestId,
        Integer amount
) {

}
