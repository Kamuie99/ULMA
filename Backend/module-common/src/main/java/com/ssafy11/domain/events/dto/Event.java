package com.ssafy11.domain.events.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class Event {
    private Integer id;
    private String category;
    private String name;
    private LocalDateTime eventTime;
}
