package com.ssafy11.api.service;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.dto.EventCommand;
import com.ssafy11.domain.events.EventDao;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.participant.dto.EventParticipant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {
    private final EventDao eventDao;

    public Integer addEvent(EventCommand event, String userId) {
        Assert.notNull(event, "Event must not be null");
        Assert.hasText(userId, "UserId must not be null");
        Integer eventId = eventDao.addEvent(event, Integer.parseInt(userId));
        Assert.notNull(eventId, "Event id must not be null");
        return eventId;
    }

    public boolean isUserEventCreated(final Integer eventId, final String userId) {
        Assert.notNull(eventId, "eventId is required");
        Assert.hasText(userId, "UserId must not be null");
        return eventDao.isUserEventCreated(eventId, Integer.parseInt(userId));
    }

    public Integer updateEvent(EventCommand event, Integer eventId, String userId) {
        Assert.notNull(event, "Event must not be null");
        Assert.notNull(eventId, "EventId must not be null");
        Assert.hasText(userId, "userId is required");

        Assert.isTrue(isUserEventCreated(eventId, userId), "사용자가 만든 이벤트가 아닙니다.");

        Integer resultId = eventDao.updateEvent(event, eventId);
        Assert.notNull(eventId, "Event id must not be null");
        return resultId;
    }

    @Transactional(readOnly = true)
    public PageResponse<Event> getEvents(String userId, PageDto pageDto) {
        Assert.hasText(userId, "User must not be null");

        PageResponse<Event> eventsList = eventDao.getEvents(Integer.parseInt(userId), pageDto);
        Assert.notNull(eventsList, "Events list must not be null");
        return eventsList;

    }

    @Transactional(readOnly = true)
    public PageResponse<EventParticipant> getEvent(String userId, Integer eventId, PageDto pageDto) {
        Assert.notNull(eventId, "Event must not be null");
        Assert.hasText(userId, "UserId must not be null");
        Assert.isTrue(Integer.parseInt(userId)==(eventDao.getEventByUserId(eventId)), "유저가 만든 이벤트가 아닙니다.");

        PageResponse<EventParticipant> guestsList = eventDao.getEvent(eventId, pageDto);
        Assert.notNull(guestsList, "Guests list must not be null");
        return guestsList;
    }

    public Integer deleteEvent(Integer eventId, String userId) {
        Assert.notNull(eventId, "eventId must not be null");
        Assert.hasText(userId, "UserId must not be null");
        Assert.isTrue(Integer.parseInt(userId)==(eventDao.getEventByUserId(eventId)), "유저가 만든 이벤트가 아닙니다.");

        Integer resultId = eventDao.deleteEvent(eventId, Integer.parseInt(userId));
        Assert.notNull(resultId, "Event id must not be null");
        return resultId;

    }
}
