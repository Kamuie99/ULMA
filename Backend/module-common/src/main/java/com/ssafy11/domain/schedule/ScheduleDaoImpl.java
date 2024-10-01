package com.ssafy11.domain.schedule;

import com.ssafy11.domain.schedule.dto.RecentSchedule;
import com.ssafy11.domain.schedule.dto.Schedule;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.DatePart;
import org.jooq.Field;
import org.jooq.Record1;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ssafy11.ulma.generated.Tables.*;
import static org.jooq.impl.DSL.extract;

@Transactional
@RequiredArgsConstructor
@Repository
public class ScheduleDaoImpl implements ScheduleDao{

    private final DSLContext dsl;

    @Override
    public Integer addSchedule(Schedule schedule, Integer userId) {
            Record1<Integer> saveEvent = dsl.insertInto(SCHEDULE, SCHEDULE.GUEST_ID, SCHEDULE.DATE, SCHEDULE.AMOUNT, SCHEDULE.NAME, SCHEDULE.USERS_ID, SCHEDULE.CREATE_AT)
                .values(schedule.guestId(), schedule.date(), schedule.paidAmount(), schedule.name(), userId,  LocalDateTime.now())
                .returningResult(SCHEDULE.ID)
                .fetchOne();
        Assert.notNull(saveEvent.getValue(SCHEDULE.ID), "SCHEDULE_ID 에 null 값은 허용되지 않음");
        return saveEvent.getValue(SCHEDULE.ID);
    }

    @Override
    public Integer updateSchedule(Schedule schedule) {
        Map<Field<?>, Object> updateMap = new HashMap<>();

        if (schedule.guestId() != null) updateMap.put(SCHEDULE.GUEST_ID, schedule.guestId());
        if (schedule.date() != null) updateMap.put(SCHEDULE.DATE, schedule.date());
        if (schedule.paidAmount() != null) updateMap.put(SCHEDULE.AMOUNT, schedule.paidAmount());
        if (schedule.name() != null) updateMap.put(SCHEDULE.NAME, schedule.name());

        int result = -1;
        if (!updateMap.isEmpty()) {
            result = dsl.update(SCHEDULE)
                    .set(updateMap)
                    .where(SCHEDULE.ID.eq(schedule.scheduleId()))
                    .execute();
        }
        Assert.isTrue(result == 1, "일정 업데이트 실패 데이터 정보를 확인해주세요");
        return result;
    }

    @Override
    public Integer deleteSchedule(Integer scheduleId) {
        int result = dsl.delete(SCHEDULE)
                .where(SCHEDULE.ID.eq(scheduleId))
                .execute();
        return result;
    }

    @Transactional(readOnly = true)
    @Override
    public List<Schedule> getSchedule(Integer userId, Integer year, Integer month) {
        List<Schedule> result = dsl.select(SCHEDULE.ID, SCHEDULE.GUEST_ID, SCHEDULE.DATE, SCHEDULE.AMOUNT, SCHEDULE.NAME)
                .from(SCHEDULE)
                .where(SCHEDULE.USERS_ID.eq(userId))
                .and(extract(SCHEDULE.DATE, DatePart.YEAR).eq(year))
                .and(extract(SCHEDULE.DATE, DatePart.MONTH).eq(month))
                .fetchInto(Schedule.class);

        return result;
    }

    @Override
    public boolean isMyGuest(Integer userId, Integer guestId) {
        return dsl.fetchExists(
                dsl.selectOne()
                        .from(USERS_RELATION)
                        .where(USERS_RELATION.USERS_ID.eq(userId))
                        .and(USERS_RELATION.GUEST_ID.eq(guestId))
        );
    }

    @Override
    public List<RecentSchedule> getRecentSchedule(Integer userId) {
        LocalDateTime now = LocalDate.now().atStartOfDay(); // 현재 시간
        LocalDateTime twoWeeksLater = now.plusWeeks(2); // 2주 후 시간 계산

        List<RecentSchedule> result = dsl.select(SCHEDULE.ID, SCHEDULE.DATE, SCHEDULE.NAME, GUEST.NAME)
                .from(SCHEDULE)
                .join(GUEST)
                .on(SCHEDULE.GUEST_ID.eq(GUEST.ID))
                .where(SCHEDULE.USERS_ID.eq(userId)
                        .and(SCHEDULE.DATE.between(now, twoWeeksLater))) // LocalDateTime 사용
                .fetchInto(RecentSchedule.class);

        return result;
    }


}
