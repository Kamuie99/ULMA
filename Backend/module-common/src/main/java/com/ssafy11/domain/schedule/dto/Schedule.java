package com.ssafy11.domain.schedule.dto;

import java.time.LocalDateTime;

public record Schedule (Integer scheduleId, Integer guestId, LocalDateTime date, Integer paidAmount, String name, String guestName, String category, String phoneNumber){
    public Schedule(Integer scheduleId, Integer guestId, LocalDateTime date, Integer paidAmount, String name, String guestName, String category, String phoneNumber) {
        this.scheduleId = scheduleId;
        this.guestId = guestId;
        this.date = date;
        this.paidAmount = (paidAmount == null) ? 0 : paidAmount;
        this.name = name;
        this.guestName = guestName;
        this.category = category;
        this.phoneNumber = phoneNumber;
    }
}
