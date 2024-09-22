package com.ssafy11.domain.events;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.participant.dto.EventParticipant;

public interface EventDao {
    Integer addEvent(EventCommand event);
    PageResponse<Event> getEvents(Integer userId, PageDto pageDto);
    PageResponse<EventParticipant> getEvent(Integer eventId, PageDto pageDto);
    Integer getEventByUserId(Integer eventId);
}