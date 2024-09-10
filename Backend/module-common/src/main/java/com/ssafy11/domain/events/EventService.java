package com.ssafy11.domain.events;

import com.ssafy11.domain.events.dto.Events;
import com.ssafy11.domain.friends.dto.Friends;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;

@Service
public class EventService {
    private final EventDao eventDao;

    @Autowired
    public EventService(EventDao eventDao) {
        this.eventDao = eventDao;
    }

    public Integer save(EventCommand event) {
        Assert.notNull(event, "Event must not be null");
        return eventDao.save(event);
    }

    public List<Events> getEvents(Integer userId) {
        Assert.notNull(userId, "User must not be null");

        List<Events> EventsList = eventDao.getEvents(userId);
        return EventsList != null ? EventsList : Collections.emptyList();

    }

    public List<Friends> getGuests(Integer userId, Integer eventId) {
        Assert.notNull(userId, "User must not be null");
        Assert.notNull(eventId, "Event must not be null");

        List<Friends> guestsList = eventDao.getGuests(userId, eventId);
        return guestsList != null ? guestsList : Collections.emptyList();    }



}
