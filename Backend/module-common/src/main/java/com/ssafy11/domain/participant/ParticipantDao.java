package com.ssafy11.domain.participant;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import org.jooq.Record1;

import java.util.List;

public interface ParticipantDao {
    List<UserRelation> sameName(Integer userId, String name);
    PaginatedResponse<Transaction> getTransactions(Integer userId, Integer guestId, PageDto pageDto);
    //Record1<Integer> addGuests(Participant participant);
    Record1<Integer> addFriends(Integer userId, Integer guestId);
}
