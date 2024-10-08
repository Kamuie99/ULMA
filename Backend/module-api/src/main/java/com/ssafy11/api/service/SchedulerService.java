package com.ssafy11.api.service;

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

import org.jooq.Record;

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
            Record result = schedulerDao.analyzePay(category);

            if (result != null) {
                BigDecimal under50kRatio = Optional.ofNullable(result.get("under_50k_ratio", Double.class))
                        .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal between50k100kRatio = Optional.ofNullable(result.get("between_50k_100k_ratio", Double.class))
                        .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal between100k150kRatio = Optional.ofNullable(result.get("between_100k_150k_ratio", Double.class))
                        .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal above150kRatio = Optional.ofNullable(result.get("above_150k_ratio", Double.class))
                        .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal minAmount = Optional.ofNullable(result.get("min_amount", Double.class))
                        .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal maxAmount = Optional.ofNullable(result.get("max_amount", Double.class))
                        .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                BigDecimal topAmount = Optional.ofNullable(result.get("top_amount", Double.class))
                        .map(value -> BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP))
                        .orElse(BigDecimal.ZERO);

                String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                schedulerDao.saveAnalyzePay(under50kRatio, between50k100kRatio, between100k150kRatio, above150kRatio, minAmount, maxAmount, topAmount, category, currentTime);
            }
        }
    }
}
