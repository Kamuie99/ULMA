package com.ssafy11.api.controller;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.api.service.ParticipantService;
import com.ssafy11.domain.participant.dto.AddGuestResponse;
import com.ssafy11.domain.participant.dto.Participant;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
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
    public ResponseEntity<?> sameName(@AuthenticationPrincipal User user,
                                      @PathVariable("userId") Integer userId,
                                      @RequestParam("name") String name) {
        Assert.notNull(userId, "userId must not be null");
        Assert.notNull(name, "name must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(userId)), "User ID does not match");

        List<UserRelation> userRelationList = participantService.sameName(userId, name);
        return ResponseEntity.ok(userRelationList);
    }

    //등록된 지인과 거래 내역
    @GetMapping("/{userId}/{guestID}")
    public ResponseEntity<?> getTransactions(
                                            @AuthenticationPrincipal User user,
                                            @PathVariable("userId") Integer userId,
                                            @PathVariable("guestID") Integer guestId,
                                            @ModelAttribute PageDto pagedto) {
        Assert.notNull(userId, "userId must not be null");
        Assert.notNull(guestId, "guestID must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(userId)), "User ID does not match");

        PaginatedResponse<Transaction> transactions = participantService.getTransactions(userId, guestId, pagedto);
        return ResponseEntity.ok(transactions);
    }

    //경조사비 추가
    @PostMapping("/money") //중복 에러 추가하기
    public ResponseEntity<?> addParticipant(@AuthenticationPrincipal User user,
                                            @RequestBody Participant participant) {
        Assert.notNull(participant, "participant must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(participant.getUserId())), "User ID does not match");

        Integer resultId = participantService.addParticipant(participant);
        return ResponseEntity.ok(resultId);
    }

    //지인 등록
    @PostMapping
    public ResponseEntity<?> addGuestAndUserRelation(@AuthenticationPrincipal User user,
                                                     @RequestBody AddGuestResponse addGuestResponse) {
        Assert.notNull(addGuestResponse, "addGuestResponse must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(addGuestResponse.getUserId())), "User ID does not match");

        Integer resultId = participantService.addGuestAndUserRelation(addGuestResponse);
        return ResponseEntity.ok(resultId);
    }

    //등록된 지인 정보 /api/participant/{user_id}
    @GetMapping("/{userId}")
    public ResponseEntity<?> getParticipants(@AuthenticationPrincipal User user,
                                             @PathVariable("userId") Integer userId,
                                             @ModelAttribute PageDto pagedto) {
        Assert.notNull(userId, "userId must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(userId)), "User ID does not match");
        PaginatedResponse<UserRelation> transactions = participantService.getUserRelation(userId, pagedto);
        return ResponseEntity.ok(transactions);
    }

}
