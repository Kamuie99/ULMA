package com.ssafy11.domain.schedule.dto;

import java.time.LocalDateTime;

public record Schedule (Integer scheduleId, Integer guestId, LocalDateTime date, Integer paidAmount, String name){
}
