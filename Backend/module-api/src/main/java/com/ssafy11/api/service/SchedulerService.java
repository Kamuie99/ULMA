package com.ssafy11.api.service;

import com.ssafy11.domain.scheduler.dto.PaymentAnalysisDto;
import com.ssafy11.domain.scheduler.SchedulerDao;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Transactional
@Service
public class SchedulerService {
    private final SchedulerDao schedulerDao;

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void scheduledTask() {
        List<String> categories = List.of("돌잔치", "장례식", "생일", "결혼식", "기타");
        for (String category : categories) {
            PaymentAnalysisDto result = schedulerDao.analyzePay(category);

            if (result != null) {
                BigDecimal under50kRatio = Optional.ofNullable(result.under50kRatio())
                        .map(value -> value.setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal between50k100kRatio = Optional.ofNullable(result.between50k100kRatio())
                        .map(value -> value.setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal between100k150kRatio = Optional.ofNullable(result.between100k150kRatio())
                        .map(value -> value.setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal above150kRatio = Optional.ofNullable(result.above150kRatio())
                        .map(value -> value.setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal minAmount = Optional.ofNullable(result.minAmount())
                        .map(value -> value.setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal maxAmount = Optional.ofNullable(result.maxAmount())
                        .map(value -> value.setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal topAmount = Optional.ofNullable(result.topAmount())
                        .map(value -> value.setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                schedulerDao.saveAnalyzePay(
                        under50kRatio,
                        between50k100kRatio,
                        between100k150kRatio,
                        above150kRatio,
                        minAmount,
                        maxAmount,
                        topAmount,
                        category,
                        currentTime
                );
            }
        }
    }
}
