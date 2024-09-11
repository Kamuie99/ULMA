package com.ssafy11.api.service;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.ParticipantDao;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;

@Service
@Transactional
public class ParticipantService {
    private final ParticipantDao participantDao;

    @Autowired
    public ParticipantService(ParticipantDao participantDao) {
        this.participantDao = participantDao;
    }

    public List<UserRelation> sameName(Integer userId, String name){
        Assert.notNull(userId, "userId is required");
        Assert.notNull(name, " name is required");
        List<UserRelation> userRelationList = participantDao.sameName(userId, name);
        return userRelationList;
    }

    public PaginatedResponse<Transaction> getTransactions(Integer userId, Integer guestId, PageDto pagedto){
        Assert.notNull(userId, "userId is required");
        Assert.notNull(guestId, "guestId is required");
        PaginatedResponse<Transaction> transactionsList = participantDao.getTransactions(userId, guestId, pagedto);
        return transactionsList;
    }


}
