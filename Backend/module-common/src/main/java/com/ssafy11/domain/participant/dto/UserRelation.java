package com.ssafy11.domain.participant.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserRelation { //사용자의 지인
    Integer guestId;
    String guestName;
    String category;
}
