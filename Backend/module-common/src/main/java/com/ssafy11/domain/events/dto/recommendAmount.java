package com.ssafy11.domain.events.dto;

import lombok.Builder;

@Builder
public record recommendAmount (
        Double under50kRatio,
        Double between50k100kRatio,
        Double between100k150kRatio,
        Double above150kRatio,
        Integer minAmount,
        Integer maxAmount,
        Integer topAmount) {
}
