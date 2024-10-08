package com.ssafy11.domain.scheduler;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record;

import org.jooq.impl.DSL;
import org.jooq.impl.DefaultDSLContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static com.ssafy11.ulma.generated.Tables.*;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Repository
public class SchedulerDaoImpl implements SchedulerDao {

    private final DefaultDSLContext dslContext;

    @Override
    public Record analyzePay(String category) {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);

        return dslContext
            .select(
                DSL.count(DSL.when(PARTICIPATION.AMOUNT.lt(50000), 1)).div(DSL.count()).mul(100).as("under_50k_ratio"),
                DSL.count(DSL.when(PARTICIPATION.AMOUNT.between(50000, 100000), 1)).div(DSL.count()).mul(100).as("between_50k_100k_ratio"),
                DSL.count(DSL.when(PARTICIPATION.AMOUNT.between(100000, 150000), 1)).div(DSL.count()).mul(100).as("between_100k_150k_ratio"),
                DSL.count(DSL.when(PARTICIPATION.AMOUNT.gt(150000), 1)).div(DSL.count()).mul(100).as("above_150k_ratio"),

                DSL.min(PARTICIPATION.AMOUNT).as("min_amount"),
                DSL.max(PARTICIPATION.AMOUNT).as("max_amount"),

                DSL.select(PARTICIPATION.AMOUNT)
                        .from(PARTICIPATION)
                        .join(EVENT).on(PARTICIPATION.EVENT_ID.eq(EVENT.ID))
                        .where(EVENT.CATEGORY.eq(category))
                        .and(EVENT.DATE.greaterThan(oneYearAgo))
                        .groupBy(PARTICIPATION.AMOUNT)
                        .orderBy(DSL.count().desc())
                        .limit(1)
                        .asField("top_amount")
                )
            .from(PARTICIPATION)
            .join(EVENT).on(PARTICIPATION.EVENT_ID.eq(EVENT.ID))
            .where(EVENT.CATEGORY.eq(category))
            .and(EVENT.DATE.greaterThan(oneYearAgo))
            .fetchOne();
    }

    @Override
    public void saveAnalyzePay(BigDecimal under50kRatio, BigDecimal between50k100kRatio,
                               BigDecimal between100k150kRatio, BigDecimal above150kRatio,
                               BigDecimal minAmount, BigDecimal maxAmount,
                               BigDecimal topAmount, String category, String currentTime){

        dslContext.insertInto(PAYMENT_ANALYSIS)
                .set(PAYMENT_ANALYSIS.UNDER_50K_RATIO, under50kRatio)
                .set(PAYMENT_ANALYSIS.BETWEEN_50K_100K_RATIO, between50k100kRatio)
                .set(PAYMENT_ANALYSIS.BETWEEN_100K_150K_RATIO, between100k150kRatio)
                .set(PAYMENT_ANALYSIS.ABOVE_150K_RATIO, above150kRatio)
                .set(PAYMENT_ANALYSIS.MIN_AMOUNT, minAmount)
                .set(PAYMENT_ANALYSIS.MAX_AMOUNT, maxAmount)
                .set(PAYMENT_ANALYSIS.TOP_AMOUNT, topAmount)
                .set(PAYMENT_ANALYSIS.CATEGORY, category)
                .set(PAYMENT_ANALYSIS.CREATE_AT, currentTime) 
                .execute();
    }


}