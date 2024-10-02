package com.ssafy11.domain.participant.dto;

import lombok.Builder;
import lombok.Setter;

@Builder
public record UserRelation(
        Integer guestId,
        String name,
        String category,
        String phoneNumber,
        Integer totalBalance) { //사용자의 지인
}
