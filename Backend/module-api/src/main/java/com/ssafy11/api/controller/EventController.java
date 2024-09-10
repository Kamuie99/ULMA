package com.ssafy11.api.controller;

import com.ssafy11.domain.events.EventCommand;
import com.ssafy11.domain.events.EventDao;
import com.ssafy11.domain.events.EventService;
import com.ssafy11.domain.events.dto.Events;
import com.ssafy11.domain.friends.dto.Friends;
import com.ssafy11.domain.friends.dto.Guests;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping() //이벤트 추가
    public ResponseEntity<?> addEvent(@RequestBody EventCommand event) {
        Assert.notNull(event, "Event must not be null");
        Integer eventId = eventService.save(event);
        return ResponseEntity.ok(eventId);
    }

    @GetMapping("/{userId}") //이벤트 목록
    public ResponseEntity<?> getAllEvents(@PathVariable("userId") Integer userId) {
        Assert.notNull(userId, "userId must not be null");
        List<Events> events = eventService.getEvents(userId);
        return ResponseEntity.ok(events);
    }

    //이벤트 상세 목록(해당 이벤트 경조사 내역)
    @GetMapping("/{userId}/{eventId}")
    public ResponseEntity<?> getEvent(@PathVariable("userId") Integer userId, @PathVariable("eventId") Integer eventId) {
        Assert.notNull(userId, "userId must not be null");
        Assert.notNull(eventId, "eventId must not be null");
        List<Friends> guests = eventService.getGuests(userId, eventId);
        return ResponseEntity.ok(guests);
    }


    //경조사비 추가


    //받은 경조사비 추천
//    @PostMapping("/money")
//    public ResponseEntity<?> addMoney(@ResponseBody())


}
