package com.ssafy11.domain.events;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.Participant;

public interface EventDao {
    Integer addEvent(EventCommand event);
    PaginatedResponse<Event> getEvents(Integer userId, PageDto pageDto);
    PaginatedResponse<Participant> getEvent(Integer eventId, PageDto pageDto);
}