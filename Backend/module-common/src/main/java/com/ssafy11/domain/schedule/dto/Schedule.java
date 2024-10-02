package com.ssafy11.domain.schedule.dto;

import java.time.LocalDateTime;

public record Schedule (Integer scheduleId, Integer guestId, LocalDateTime date, Integer paidAmount, String name){
    public Schedule(Integer scheduleId, Integer guestId, LocalDateTime date, Integer paidAmount, String name) {
        this.scheduleId = scheduleId;
        this.guestId = guestId;
        this.date = date;
        this.paidAmount = (paidAmount == null) ? 0 : paidAmount;
        this.name = name;
    }
}
