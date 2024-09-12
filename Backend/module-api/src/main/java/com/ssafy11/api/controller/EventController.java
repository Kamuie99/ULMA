package com.ssafy11.api.controller;

import com.ssafy11.api.service.GptService;
import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.EventCommand;
import com.ssafy11.api.service.EventService;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.EventParticipant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    //private final GptService gptService;

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

        PaginatedResponse<EventParticipant> guests = eventService.getEvent(eventId, pagedto);
        return ResponseEntity.ok(guests);
    }

    //자체 금액 추천

    //경조사비 입출금 목록 조회

    //경조사 AI 금액 추천 <- 미완성
//    @PostMapping("/ai/recommend/money")
//    public String addParticipant(@RequestBody GptMoneyReq gptMoneyReq) {
//            String resultQuestion = gptMoneyReq.getEventName() +" " + gptMoneyReq.getIntimacy() + "짧게 경조사비만 알려줘";
//            System.out.println(resultQuestion);
//            String GptMoney = gptService.getChatResponse(resultQuestion);
//
//            return GptMoney;
//    }

    //AI 축하 메시지


}
