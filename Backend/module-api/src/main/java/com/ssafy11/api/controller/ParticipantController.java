package com.ssafy11.api.controller;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.api.service.ParticipantService;
import com.ssafy11.domain.participant.dto.Participant;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/participant")
public class ParticipantController {

    private final ParticipantService participantService;

    //동명이인
    @GetMapping("/same/{userId}")
    public ResponseEntity<?> sameName(@PathVariable("userId") Integer userId, @RequestParam("name") String name) {
        Assert.notNull(userId, "userId must not be null");
        Assert.notNull(name, "name must not be null");
        List<UserRelation> userRelationList = participantService.sameName(userId, name);
        return ResponseEntity.ok(userRelationList);
    }

    //등록된 지인과 거래 내역
    @GetMapping("/{userId}/{guestID}")
    public ResponseEntity<?> getTransactions(@PathVariable("userId") Integer userId,
                                            @PathVariable("guestID") Integer guestId,
                                            @ModelAttribute PageDto pagedto) {
        Assert.notNull(userId, "userId must not be null");
        Assert.notNull(guestId, "guestID must not be null");
        PaginatedResponse<Transaction> transactions = participantService.getTransactions(userId, guestId, pagedto);
        return ResponseEntity.ok(transactions);
    }

    //경조사비 추가
    @PostMapping("/money")
    public ResponseEntity<?> addParticipant(@RequestBody Participant participant) {
        Assert.notNull(participant, "participant must not be null");
        Integer resultId = participantService.addParticipant(participant);
        return ResponseEntity.ok(resultId);
    }

    //지인 등록 /api/participant

    //등록된 지인 정보 /api/participant/{user_id}




}
