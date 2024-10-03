package com.ssafy11.domain.participant;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.participant.dto.*;

import java.util.List;

public interface ParticipantDao {
    PageResponse<UserRelation> sameName(Integer userId, String name, String category, PageDto pageDto);
    PageResponse<Transaction> getTransactions(Integer userId, Integer guestId, PageDto pageDto);
    TransactionSummary getTransactionSummary(Integer userId, Integer guestId);
    Boolean isParticipant(Integer eventId, Integer participantId);
    Integer addParticipants(List<Participant> participants);
    Integer updateParticipant(Participant participant);
    Integer deleteParticipant(Participant participant);
    Boolean isPhoneNumber(String phoneNumber, Integer userId);
    Integer addGuests(String name, String category, String phoneNumber);
    Integer addUserRelation(List<Integer> guestIds, Integer userId);
    PageResponse<UserRelation> getUserRelations(Integer userId, PageDto pageDto);
}
