package com.ssafy11.api.controller;

//import com.ssafy11.api.service.GptService;
import com.ssafy11.api.service.GptService;
import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.EventCommand;
import com.ssafy11.api.service.EventService;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.EventParticipant;
import com.ssafy11.domain.participant.dto.GptResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final GptService gptService;

    @PostMapping() //이벤트 추가
    public ResponseEntity<?> addEvent(@AuthenticationPrincipal User user,
                                      @RequestBody EventCommand event) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Assert.notNull(event, "Event must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(event.userId())), "User ID does not match");

        Integer eventId = eventService.addEvent(event);
        return ResponseEntity.ok(eventId);
    }

    @GetMapping("/{userId}") //이벤트 목록
    public ResponseEntity<?> getAllEvents(@AuthenticationPrincipal User user,
                                          @PathVariable("userId") Integer userId,
                                          @ModelAttribute PageDto pagedto) {
        Assert.notNull(userId, "userId must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(userId)), "User ID does not match");

        PaginatedResponse<Event> events = eventService.getEvents(userId, pagedto);
        return ResponseEntity.ok(events);
    }

    //이벤트 상세 목록(해당 이벤트 경조사 내역)
    @GetMapping("/detail/{userId}/{eventId}")
    //eventId가 내가 주최하지 않는 경우의 검증 로직 필요
    public ResponseEntity<?> getEvent(@AuthenticationPrincipal User user,
                                      @PathVariable("userId") Integer userId,
                                      @PathVariable("eventId") Integer eventId,
                                      @ModelAttribute PageDto pagedto) {
        Assert.notNull(eventId, "eventId must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(userId)), "User ID does not match");

        PaginatedResponse<EventParticipant> guests = eventService.getEvent(eventId, pagedto);
        return ResponseEntity.ok(guests);
    }

    //자체 금액 추천 <- 배치 사용하기

    //경조사 AI 축하 메시지 추천 <- 미완성
    @PostMapping("/ai/recommend/message")
    public String aiMessage(@AuthenticationPrincipal User user,
                            @RequestBody GptResponse gptResponse) {
        Assert.notNull(gptResponse, "gptResponse must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(gptResponse.getUserId())), "User ID does not match");

        String resultQuestion = gptResponse.getGptQuotes() + " 다른 말 없이 경조사 메세지 3개만 제공해줘";
        System.out.println(resultQuestion);
        String GptMoney = gptService.getChatResponse(resultQuestion, 0);

        return GptMoney;
    }

    //AI 금액 추천
    @PostMapping("/ai/recommend/money")
    public String aiAmount(@AuthenticationPrincipal User user,
                           @RequestBody GptResponse gptResponse) {
        Assert.notNull(gptResponse, "gptResponse must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(gptResponse.getUserId())), "User ID does not match");

        String resultQuestion = gptResponse.getGptQuotes() + " 다른 말 없이 평균적인 경조사비 금액만 말해줘";
        System.out.println(resultQuestion);
        String GptMoney = gptService.getChatResponse(resultQuestion, 1);

        return GptMoney;
    }

}
