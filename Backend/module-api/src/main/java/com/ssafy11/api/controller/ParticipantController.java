package com.ssafy11.api.controller;

import com.ssafy11.api.dto.ExcelParse;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.api.service.ExcelService;
import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.api.service.ParticipantService;
import com.ssafy11.domain.participant.dto.*;
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
    @GetMapping("/same")
    public ResponseEntity<PageResponse<UserRelation>> sameName(@AuthenticationPrincipal User user,
                                      @RequestParam(value = "name", required = false) String name,
                                      @RequestParam(value = "category", required = false) String category,
                                      @ModelAttribute PageDto pagedto) {

        PageResponse<UserRelation> userRelationList = participantService.sameName(user.getUsername(), name, category, pagedto);
        return ResponseEntity.ok(userRelationList);
    }

    //등록된 지인과 거래 내역
    @GetMapping("/{guestId}")
    public ResponseEntity<PageResponse<Transaction>> getTransactions(@AuthenticationPrincipal User user,
                                            @PathVariable("guestId") Integer guestId,
                                            @ModelAttribute PageDto pagedto) {
        Assert.notNull(guestId, "guestID must not be null");

        PageResponse<Transaction> transactions = participantService.getTransactions(user.getUsername(), guestId, pagedto);
        return ResponseEntity.ok(transactions);
    }

    //거래내역 요약
    @GetMapping("/summary/{guestId}")
    public ResponseEntity<TransactionSummary> getTransactionSummary(@AuthenticationPrincipal User user,
                                            @PathVariable("guestId") Integer guestId ){
        Assert.notNull(guestId, "guestId must not be null");
        TransactionSummary transactionSummary = participantService.getTransactionSummary(user.getUsername(), guestId);
        return ResponseEntity.ok(transactionSummary);
    }

    //경조사비 추가(직접)
    @PostMapping("/money")
    public ResponseEntity<Integer> addParticipants(@AuthenticationPrincipal User user,
                                            @RequestBody List<Participant> participant) {
        Assert.notNull(participant, "participant must not be null");

        Integer resultId = participantService.addParticipants(participant, user.getUsername());
        return ResponseEntity.ok(resultId);
    }

    //경조사비 추가(엑셀)
    @PostMapping("/money/excel")
    public ResponseEntity<List<ExcelParse>> addParticipantExcel(@AuthenticationPrincipal User user,
                                                 @RequestPart("file") MultipartFile file) {
        Assert.notNull(file, "file must not be null");
        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("application/vnd.ms-excel") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))) {
                    throw new ErrorException(ErrorCode.NOT_EXCEL);
                }

        List<ExcelParse> result = excelService.parseExcelFile(file);
        return ResponseEntity.ok(result);
    }

    //경조사비 수정
    @PutMapping //이벤트 수정
    public ResponseEntity<Integer> updateParticipant(@AuthenticationPrincipal User user,
                                               @RequestBody Participant participant) {
        Assert.notNull(participant, "participant must not be null");
        Assert.notNull(participant.guestId(), "participant.guestId must not be null");
        Assert.notNull(participant.amount(), "participant.amount must not be null");
        Assert.notNull(participant.preGuestId(), "participant.preGuestId must not be null");
        Assert.notNull(participant.eventId(), "participant.eventId must not be null");

        int returnId = participantService.updateParticipant(participant, user.getUsername());
        return ResponseEntity.ok(returnId);
    }

    //경조사비 삭제
    @DeleteMapping
    public ResponseEntity<Integer> deleteParticipant(@AuthenticationPrincipal User user,
                                               @RequestBody Participant participant){
        Assert.notNull(participant, "participant must not be null");
        Assert.notNull(participant.eventId(), "participant.eventId must not be null");
        Assert.notNull(participant.guestId(), "participant.guestId must not be null");

        int resultId = participantService.deleteParticipant(participant, user.getUsername());
        return ResponseEntity.ok(resultId);
    }

    //지인 등록
    @PostMapping
    public ResponseEntity<Integer> addGuestAndUserRelation(@AuthenticationPrincipal User user,
                                                     @RequestBody List<AddGuestResponse> addGuestResponse) {
        Assert.notNull(addGuestResponse, "addGuestResponse must not be null");

        Integer resultId = participantService.addGuestAndUserRelation(addGuestResponse, user.getUsername());
        return ResponseEntity.ok(resultId);
    }

    //등록된 지인 정보
    @GetMapping
    public ResponseEntity<PageResponse<UserRelation>> getParticipants(@AuthenticationPrincipal User user,
                                             @ModelAttribute PageDto pagedto) {
        PageResponse<UserRelation> transactions = participantService.getUserRelation(user.getUsername(), pagedto);
        return ResponseEntity.ok(transactions);
    }

}
