package com.ssafy11.domain.friends.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class Transactions {
    Integer eventId;
    Integer GuestId;
    String Name;
    LocalDateTime Date;
    Integer amount;
}
