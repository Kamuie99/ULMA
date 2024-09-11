package com.ssafy11.domain.participant.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class Transaction { //사용자와 게스트의 거래내역
    String guestId;
    Integer eventId;
    String eventName;
    LocalDateTime date;
    Integer amount;




}
