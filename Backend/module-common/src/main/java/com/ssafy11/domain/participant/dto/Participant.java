package com.ssafy11.domain.participant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Participant {
    private Integer eventId;
    private Integer guestId;
    private Integer amount;
}
