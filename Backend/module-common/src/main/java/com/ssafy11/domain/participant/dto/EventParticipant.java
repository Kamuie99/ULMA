package com.ssafy11.domain.participant.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class EventParticipant { //이벤트에 대한 참가자의 경조사비 여부
    Integer guestId;
    String guestName;
    String category;
    Integer amount;
}
