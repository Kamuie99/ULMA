package com.ssafy11.api.controller;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.EventCommand;
import com.ssafy11.api.service.EventService;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.Participant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

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
        Integer eventId = eventService.addEvent(event);
        return ResponseEntity.ok(eventId);
    }

    @GetMapping("/{userId}") //이벤트 목록
    public ResponseEntity<?> getAllEvents(@PathVariable("userId") Integer userId, @ModelAttribute PageDto pagedto) {
        Assert.notNull(userId, "userId must not be null");

        PaginatedResponse<Event> events = eventService.getEvents(userId, pagedto);
        return ResponseEntity.ok(events);
    }

    //이벤트 상세 목록(해당 이벤트 경조사 내역)
    @GetMapping("/detail/{eventId}")
    public ResponseEntity<?> getEvent(@PathVariable("eventId") Integer eventId,
                                      @ModelAttribute PageDto pagedto) {
        Assert.notNull(eventId, "eventId must not be null");

        PaginatedResponse<Participant> guests = eventService.getEvent(eventId, pagedto);
        return ResponseEntity.ok(guests);
    }


    //경조사비 추가


    //받은 경조사비 추천
//    @PostMapping("/money")
//    public ResponseEntity<?> addMoney(@ResponseBody())


}
