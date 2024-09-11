package com.ssafy11.api.controller;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.api.service.ParticipantService;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participant")
public class ParticipantController {

    private final ParticipantService participantService;

    @Autowired
    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    //동일 이름 검증
    @GetMapping("/same/{userId}")
    public ResponseEntity<?> sameName(@PathVariable("userId") Integer userId, @RequestParam("name") String name) {
        List<UserRelation> userRelationList = participantService.sameName(userId, name);
        return ResponseEntity.ok(userRelationList);
    }

    //송금 내역 확인
    @GetMapping("/{userId}/{guestID}")
    public ResponseEntity<?> getTransactions(@PathVariable("userId") Integer userId,
                                            @PathVariable("guestID") Integer guestId,
                                            @ModelAttribute PageDto pagedto) {
        PaginatedResponse<Transaction> transactions = participantService.getTransactions(userId, guestId, pagedto);
        return ResponseEntity.ok(transactions);
    }

    //게스트 추가
//    @PostMapping()
//    public ResponseEntity<?> addGuests(@RequestBody Guests guest) {
//        Integer guestId
//    }

    //경조사 추가


}
