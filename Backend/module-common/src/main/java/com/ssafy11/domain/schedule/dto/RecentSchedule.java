package com.ssafy11.domain.schedule.dto;

import java.time.LocalDateTime;

public record RecentSchedule (Integer scheduleId, LocalDateTime date, String name, String guestName){
}
