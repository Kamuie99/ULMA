package com.ssafy11.api.controller;

import com.ssafy11.api.service.ScheduleService;
import com.ssafy11.domain.schedule.dto.RecentSchedule;
import com.ssafy11.domain.schedule.dto.Schedule;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping //일정 추가
    public ResponseEntity<Integer> addSchedule(@AuthenticationPrincipal User user,
                                               @RequestBody Schedule schedule) {
        Assert.notNull(schedule, "schedule must not be null");

        Integer scheduleId = scheduleService.addSchedule(user.getUsername(), schedule);
        return ResponseEntity.ok(scheduleId);
    }

    @GetMapping //일정 조회
    public ResponseEntity<List<Schedule>>getSchedule(@AuthenticationPrincipal User user,
                                                     @RequestParam("year") Integer year,
                                                     @RequestParam("month") Integer month) {
        List<Schedule> scheduleList = scheduleService.getSchedule(user.getUsername(), year, month);
        return ResponseEntity.ok(scheduleList);
    }

    @DeleteMapping ("/{scheduleId}")//일정 삭제
    public ResponseEntity<Integer> deleteSchedule(@AuthenticationPrincipal User user,
                                                  @PathVariable("scheduleId") Integer scheduleId) {
        Assert.notNull(scheduleId, "scheduleId must not be null");

        Integer returnId = scheduleService.deleteSchedule(scheduleId, user.getUsername());
        return ResponseEntity.ok(returnId);
    }

    @PatchMapping //일정 수정
    public ResponseEntity<Integer> updateSchedule(@AuthenticationPrincipal User user,
                                               @RequestBody Schedule schedule) {
        Assert.notNull(schedule, "schedule must not be null");
        int returnId = scheduleService.updateSchedule(schedule,user.getUsername());
        return ResponseEntity.ok(returnId);
    }

    @GetMapping("/recent") //최근 일정 조회
    public ResponseEntity<List<RecentSchedule>> getRecentSchedule(@AuthenticationPrincipal User user) {
        List<RecentSchedule> scheduleList = scheduleService.getRecentSchedule(user.getUsername());
        return ResponseEntity.ok(scheduleList);
    }
}
