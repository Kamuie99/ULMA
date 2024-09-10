package com.ssafy11.domain.friends.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Friends {
    Integer Id;
    String Name;
    String Category;
}
