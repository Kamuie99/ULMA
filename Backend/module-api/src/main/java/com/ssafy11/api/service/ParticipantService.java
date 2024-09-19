package com.ssafy11.api.service;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PaginatedResponse;
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

    @Transactional(readOnly = true)
    public List<UserRelation> sameName(Integer userId, String name){
        Assert.notNull(userId, "userId is required");
        Assert.notNull(name, " name is required");
        List<UserRelation> userRelationList = participantDao.sameName(userId, name);
        return userRelationList;
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Transaction> getTransactions(Integer userId, Integer guestId, PageDto pagedto){
        Assert.notNull(userId, "userId is required");
        Assert.notNull(guestId, "guestId is required");
        PaginatedResponse<Transaction> transactionsList = participantDao.getTransactions(userId, guestId, pagedto);
        return transactionsList;
    }

    public Integer addParticipant(Participant participant){
        Assert.notNull(participant, "participant is required");
        return participantDao.addParticipant(participant);
    }

    public Integer addGuestAndUserRelation(AddGuestResponse addGuestResponse){
        Assert.notNull(addGuestResponse, "addGuestResponse is required");
        Integer guestId = participantDao.addGuests(addGuestResponse.getName(), addGuestResponse.getCategory());
        Assert.notNull(guestId, "guestId is required");
        return participantDao.addUserRelation(guestId, addGuestResponse.getUserId());

    }

    @Transactional(readOnly = false)
    public PaginatedResponse<UserRelation> getUserRelation(Integer userId, PageDto pagedto) {
        Assert.notNull(userId, "userId is required");
        PaginatedResponse<UserRelation> userRelationList = participantDao.getUserRelations(userId, pagedto);
        return userRelationList;
    }

}
