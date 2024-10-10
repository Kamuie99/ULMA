package com.ssafy11.domain.scheduler;

import com.ssafy11.domain.scheduler.dto.PaymentAnalysisDto;

import java.math.BigDecimal;

public interface SchedulerDao {
    PaymentAnalysisDto analyzePay(String category);
    void saveAnalyzePay(BigDecimal under50kRatio, BigDecimal between50k100kRatio,
                        BigDecimal between100k150kRatio, BigDecimal above150kRatio,
                        BigDecimal minAmount, BigDecimal maxAmount,
                        BigDecimal topAmount, String category, String currentTime);
}
