package com.ssafy11.domain.friends.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Guests {
    private int id;
    private String name;
    private String category;
}
