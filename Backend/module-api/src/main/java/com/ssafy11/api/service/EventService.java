package com.ssafy11.api.service;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.EventCommand;
import com.ssafy11.domain.events.EventDao;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.Participant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
@Transactional
public class EventService {
    private final EventDao eventDao;

    @Autowired
    public EventService(EventDao eventDao) {
        this.eventDao = eventDao;
    }

    public Integer addEvent(EventCommand event) {
        Assert.notNull(event, "Event must not be null");
        return eventDao.addEvent(event);
    }

    public PaginatedResponse<Event> getEvents(Integer userId, PageDto pageDto) {
        Assert.notNull(userId, "User must not be null");

        PaginatedResponse<Event> EventsList = eventDao.getEvents(userId, pageDto);
        return EventsList;

    }

    public PaginatedResponse<Participant> getEvent(Integer eventId, PageDto pageDto) {
        Assert.notNull(eventId, "Event must not be null");

        PaginatedResponse<Participant> guestsList = eventDao.getEvent(eventId, pageDto);
        return guestsList;
    }


}
