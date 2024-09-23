package com.ssafy11.domain.events.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
@Builder
public record Event (
        Integer id,
        String category,
        String name,
        LocalDateTime eventTime
){ }
