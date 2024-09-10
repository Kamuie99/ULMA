package com.ssafy11.domain.events.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class Events {
    private Integer id;
    private String category;
    private String name;
    private LocalDateTime eventTime;
    private Integer userId;
}
