package com.ssafy11.domain.events.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record EventCommand(
        String category,
        String name,
        LocalDateTime date,
        Integer userId
) {
}

