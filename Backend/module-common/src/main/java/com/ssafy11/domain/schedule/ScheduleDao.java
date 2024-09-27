package com.ssafy11.domain.schedule;

import com.ssafy11.domain.schedule.dto.Schedule;

import java.util.List;

public interface ScheduleDao {
    Integer addSchedule(Schedule schedule, Integer userId);
    Integer updateSchedule(Schedule schedule);
    Integer deleteSchedule(Integer scheduleId);
    List<Schedule> getSchedule(Integer userId, Integer year, Integer month);
    boolean isMyGuest(Integer userId, Integer guestId);
}
