package com.ssafy11.api.controller;

import com.ssafy11.api.dto.ExcelParse;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.api.service.ExcelService;
import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/participant")
public class ParticipantController {

    private final ParticipantService participantService;
    private final ExcelService excelService;

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

        PageResponse<Transaction> transactions = participantService.getTransactions(userId, guestId, pagedto);
        return ResponseEntity.ok(transactions);
    }

    //경조사비 추가(직접)
    @PostMapping("/money")
    public ResponseEntity<?> addParticipant(@AuthenticationPrincipal User user,
                                            @RequestBody Participant participant) {
        Assert.notNull(participant, "participant must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(participant.userId())), "User ID does not match");

        Integer resultId = participantService.addParticipant(participant);
        return ResponseEntity.ok(resultId);
    }

    //경조사비 추가(엑셀)
    @PostMapping("/money/excel")
    public ResponseEntity<?> addParticipantExcel(@AuthenticationPrincipal User user,
                                                 @RequestPart("file") MultipartFile file,
                                                 @RequestParam("userId") Integer userId) {
        Assert.notNull(file, "file must not be null");
        Assert.notNull(userId, "userId must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(userId)), "User ID does not match");
        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("application/vnd.ms-excel") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))) {
                    throw new ErrorException(ErrorCode.NotExcel);
                }

        List<ExcelParse> result = excelService.parseExcelFile(file);
        return ResponseEntity.ok(result);
    }

    //지인 등록
    @PostMapping
    public ResponseEntity<?> addGuestAndUserRelation(@AuthenticationPrincipal User user,
                                                     @RequestBody AddGuestResponse addGuestResponse) {
        Assert.notNull(addGuestResponse, "addGuestResponse must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(addGuestResponse.userId())), "User ID does not match");

        Integer resultId = participantService.addGuestAndUserRelation(addGuestResponse);
        return ResponseEntity.ok(resultId);
    }

    //등록된 지인 정보
    @GetMapping("/{userId}")
    public ResponseEntity<?> getParticipants(@AuthenticationPrincipal User user,
                                             @PathVariable("userId") Integer userId,
                                             @ModelAttribute PageDto pagedto) {
        Assert.notNull(userId, "userId must not be null");
        Assert.isTrue(user.getUsername().equals(String.valueOf(userId)), "User ID does not match");
        PageResponse<UserRelation> transactions = participantService.getUserRelation(userId, pagedto);
        return ResponseEntity.ok(transactions);
    }

}
