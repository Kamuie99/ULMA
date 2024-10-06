package com.ssafy11.api.service;

import com.ssafy11.domain.schedule.ScheduleDao;
import com.ssafy11.domain.schedule.dto.RecentSchedule;
import com.ssafy11.domain.schedule.dto.Schedule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final ScheduleDao scheduleDao;

    public boolean isMyGuest(String userId, Integer guestId){
        Assert.notNull(userId, "userId must not be null");
        Assert.notNull(guestId, "guestId must not be null");
        return scheduleDao.isMyGuest(Integer.parseInt(userId), guestId);
    }

    public Integer addSchedule(String userId, Schedule schedule){
        Assert.hasText(userId, "UserId must not be null");
        Assert.notNull(schedule, " name is required");

        Assert.isTrue(isMyGuest(userId, schedule.guestId()),"지인관계가 아닙니다.");

        Integer resultId = scheduleDao.addSchedule(schedule, Integer.parseInt(userId));
        Assert.notNull(resultId, "resultId is required");
        return resultId;
    }

    public Integer updateSchedule(Schedule schedule, String userId){
        Assert.hasText(userId, "UserId must not be null");
        Assert.notNull(schedule, " schedule is required");

        if(schedule.guestId()!=null){
            Assert.isTrue(isMyGuest(userId, schedule.guestId()),"지인관계가 아닙니다.");
        }

        Integer resultId = scheduleDao.updateSchedule(schedule);
        Assert.notNull(resultId, "resultId is required");
        return resultId;
    }

    public Integer deleteSchedule(Integer scheduleId, String userId){
        Assert.hasText(userId, "UserId must not be null");
        Assert.notNull(scheduleId, " scheduleId is required");
        //userId로 본인이 만든 일정인지 확인하는 로직 필요
        Integer resultId = scheduleDao.deleteSchedule(scheduleId);
        Assert.notNull(resultId, "resultId is required");
        return resultId;
    }

    @Transactional(readOnly = true)
    public List<Schedule> getSchedule(String userId, Integer year, Integer month){
        Assert.hasText(userId, "UserId must not be null");
        Assert.notNull(year, "Year must not be null");
        Assert.notNull(month, "Month must not be null");

        List<Schedule> scheduleList = scheduleDao.getSchedule(Integer.parseInt(userId), year, month);
        Assert.notNull(scheduleList, "scheduleList is required");
        return scheduleList;
    }

    @Transactional(readOnly = true)
    public List<RecentSchedule> getRecentSchedule(String userId){
        Assert.hasText(userId, "UserId must not be null");

        List<RecentSchedule> scheduleList = scheduleDao.getRecentSchedule(Integer.parseInt(userId));
        Assert.notNull(scheduleList, "scheduleList is required");
        return scheduleList;
    }
}
