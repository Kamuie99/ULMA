package com.ssafy11.domain.events;

import com.ssafy11.domain.events.dto.Events;
import com.ssafy11.domain.friends.dto.Friends;

import java.util.List;

public interface EventDao {
    Integer save(EventCommand event);
    List<Events> getEvents(Integer userId);
    List<Friends> getGuests(Integer userId, Integer eventId);
}