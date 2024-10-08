package com.ssafy11.domain.scheduler.dto;

import java.math.BigDecimal;

public record PaymentAnalysisDto(
        BigDecimal under50kRatio,
        BigDecimal between50k100kRatio,
        BigDecimal between100k150kRatio,
        BigDecimal above150kRatio,
        BigDecimal minAmount,
        BigDecimal maxAmount,
        BigDecimal topAmount
) {}
