package com.ssafy11.api.service;

import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.events.EventDao;
import com.ssafy11.domain.participant.ParticipantDao;
import com.ssafy11.domain.participant.dto.AddGuestResponse;
import com.ssafy11.domain.participant.dto.Participant;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ParticipantService {
    private final ParticipantDao participantDao;
    private final EventDao eventDao;

    @Transactional(readOnly = true)
    public List<UserRelation> sameName(String userId, String name){
        Assert.hasText(userId, "UserId must not be null");
        Assert.notNull(name, " name is required");
        List<UserRelation> userRelationList = participantDao.sameName(Integer.parseInt(userId), name);
        Assert.notNull(userRelationList, "userRelationList is required");
        return userRelationList;
    }

    @Transactional(readOnly = true)
    public PageResponse<Transaction> getTransactions(String userId, Integer guestId, PageDto pagedto){
        Assert.hasText(userId, "UserId must not be null");
        Assert.notNull(guestId, "guestId is required");
        PageResponse<Transaction> transactionsList = participantDao.getTransactions(Integer.parseInt(userId), guestId, pagedto);
        Assert.notNull(transactionsList, "transactionsList is required");
        return transactionsList;
    }

    public boolean isParticipant(final Integer eventId, final Integer participantId) {
        Assert.notNull(eventId, "eventId is required");
        Assert.notNull(participantId, "participantId is required");
        return participantDao.isParticipant(eventId, participantId);
    }

    public Integer addParticipant(Participant participant, String userId){
        Assert.notNull(participant, "participant is required");

        if(isParticipant(participant.eventId(), participant.guestId())){
            throw new ErrorException(ErrorCode.Duplicated);
        }

        Integer participantId = participantDao.addParticipant(participant);
        Assert.notNull(participantId, "participantId is required");
        return participantId;
    }

    public Integer updateParticipant(Participant participant, String userId) {
        Assert.notNull(participant, "participant is required");
        Assert.isTrue(eventDao.isUserEventCreated(participant.eventId(), Integer.parseInt(userId)), "사용자가 만든 이벤트가 아닙니다.");

        Integer resultId = participantDao.updateParticipant(participant);
        Assert.notNull(resultId, "resultId must not be null");
        return resultId;
    }

    public Integer deleteParticipant(Participant participant, String userId) {
        Assert.notNull(participant, "participant is required");
        Assert.isTrue(eventDao.isUserEventCreated(participant.eventId(), Integer.parseInt(userId)), "사용자가 만든 이벤트가 아닙니다.");

        Integer resultId = participantDao.deleteParticipant(participant);
        Assert.notNull(resultId, "resultId must not be null");
        return resultId;
    }

    public Integer addGuestAndUserRelation(AddGuestResponse addGuestResponse, String userId){
        Assert.notNull(addGuestResponse, "addGuestResponse is required");
        Integer guestId = participantDao.addGuests(addGuestResponse.name(), addGuestResponse.category());
        Assert.notNull(guestId, "guestId is required");
        Integer returnValue = participantDao.addUserRelation(guestId, Integer.parseInt(userId));
        Assert.notNull(returnValue, "returnValue is required");
        return returnValue;
    }

    public PageResponse<UserRelation> getUserRelation(String userId, PageDto pagedto) {
        Assert.hasText(userId, "userId is required");
        PageResponse<UserRelation> userRelationList = participantDao.getUserRelations(Integer.parseInt(userId), pagedto);
        Assert.notNull(userRelationList, "userRelationList is required");
        return userRelationList;
    }

}
