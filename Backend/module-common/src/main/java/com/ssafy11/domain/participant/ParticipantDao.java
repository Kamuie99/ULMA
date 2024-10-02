package com.ssafy11.domain.participant;

import java.util.List;
import java.util.Optional;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.guest.Guest;
import com.ssafy11.domain.participant.dto.Participant;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.TransactionSummary;
import com.ssafy11.domain.participant.dto.UserRelation;

import java.util.List;

public interface ParticipantDao {
    PageResponse<UserRelation> sameName(Integer userId, String name, String category, PageDto pageDto);
    PageResponse<Transaction> getTransactions(Integer userId, Integer guestId, PageDto pageDto);
    TransactionSummary getTransactionSummary(Integer userId, Integer guestId);
    Boolean isParticipant(Integer eventId, Integer participantId);
    Integer addParticipant(Participant participant);
    Integer updateParticipant(Participant participant);
    Integer deleteParticipant(Participant participant);
    Boolean isPhoneNumber(String phoneNumber, Integer userId);
    Integer addGuests(String name, String category, String phoneNumber);
    Integer addUserRelation(List<Integer> guestIds, Integer userId);
    PageResponse<UserRelation> getUserRelations(Integer userId, PageDto pageDto);
    PageResponse<UserRelation> getCategoryUserRelation(Integer userId, String category, PageDto pageDto);
    Optional<Guest> getGuest(Integer guestId);
}
