package com.ssafy11.domain.participant;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.participant.dto.Participant;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.TransactionSummary;
import com.ssafy11.domain.participant.dto.UserRelation;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy11.ulma.generated.Tables.*;
import static org.jooq.impl.DSL.field;

@Repository
@Transactional
@RequiredArgsConstructor
public class ParticipantDaoImpl implements ParticipantDao {

    private final DSLContext dsl;

    @Transactional(readOnly = true)
    @Override
    public List<UserRelation> sameName(Integer userId, String name) {
        List<UserRelation> result = dsl.select(GUEST.ID, GUEST.NAME, GUEST.CATEGORY, GUEST.PHONE_NUMBER)
                .from(USERS)
                .join(USERS_RELATION)
                .on(USERS.ID.eq(USERS_RELATION.USERS_ID))
                .join(GUEST)
                .on(USERS_RELATION.GUEST_ID.eq(GUEST.ID))
                .where(USERS.ID.eq(userId))
                .and(GUEST.NAME.like("%"+name+"%"))
                .fetchInto(UserRelation.class);
        return result;
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<Transaction> getTransactions(Integer userId, Integer guestId, PageDto pageDto) {
        int size = pageDto.getSize();
        int page = pageDto.getPage();
        int offset = (page - 1) * size;

        List<Transaction> transactions = dsl.select()
                .from(
                        dsl.select(PARTICIPATION.GUEST_ID, EVENT.NAME, EVENT.DATE, PARTICIPATION.AMOUNT)
                                .from(PARTICIPATION)
                                .join(EVENT).on(PARTICIPATION.EVENT_ID.eq(EVENT.ID))
                                .where(PARTICIPATION.GUEST_ID.eq(guestId).and(EVENT.USERS_ID.eq(userId)))
                                .unionAll(
                                        dsl.select(SCHEDULE.GUEST_ID, SCHEDULE.NAME, SCHEDULE.DATE, SCHEDULE.AMOUNT.neg().as("amount"))
                                                .from(SCHEDULE)
                                                .where(SCHEDULE.GUEST_ID.eq(guestId).and(SCHEDULE.USERS_ID.eq(userId)))
                                )
                )
                .orderBy(field("date").desc())
                .limit(size)
                .offset(offset)
                .fetchInto(Transaction.class);

        Integer participationCount = dsl.selectCount()
                .from(PARTICIPATION)
                .join(EVENT).on(PARTICIPATION.EVENT_ID.eq(EVENT.ID))
                .where(PARTICIPATION.GUEST_ID.eq(guestId))
                .and(EVENT.USERS_ID.eq(userId))
                .fetchOne(0, Integer.class);

        Integer scheduleCount = dsl.selectCount()
                .from(SCHEDULE)
                .where(SCHEDULE.GUEST_ID.eq(guestId))
                .and(SCHEDULE.USERS_ID.eq(userId))
                .fetchOne(0, Integer.class);

        int totalItemsCount = (participationCount != null ? participationCount : 0) + (scheduleCount != null ? scheduleCount : 0);
        int totalPages = (int) Math.ceil((double) totalItemsCount / size);

        return new PageResponse<>(transactions, page, totalItemsCount, totalPages);
    }

    @Transactional(readOnly = true)
    @Override
    public TransactionSummary getTransactionSummary(Integer userId, Integer guestId) {
        // 내가 지인에게 준 총액 (참여 테이블에서)
        Integer totalGiven = dsl.select(DSL.sum(PARTICIPATION.AMOUNT))
                .from(PARTICIPATION)
                .join(EVENT)
                .on(EVENT.ID.eq(PARTICIPATION.EVENT_ID))
                .where(PARTICIPATION.GUEST_ID.eq(guestId)
                        .and(EVENT.USERS_ID.eq(userId)))
                .fetchOne(0, Integer.class);

        // 내가 지인에게서 받은 총액 (일정 테이블에서)
        Integer totalReceived = dsl.select(DSL.sum(SCHEDULE.AMOUNT).neg())
                .from(SCHEDULE)
                .where(SCHEDULE.GUEST_ID.eq(guestId)
                        .and(SCHEDULE.USERS_ID.eq(userId)))
                .fetchOne(0, Integer.class);

        // 총계 계산
        int totalBalance = (totalReceived != null ? totalReceived : 0)+(totalGiven != null ? totalGiven : 0);

        return new TransactionSummary(totalGiven != null ? totalGiven : 0,
                totalReceived != null ? totalReceived : 0,
                totalBalance);
    }


    @Override
    public Boolean isParticipant(Integer eventId, Integer participantId) {
        return dsl.fetchExists(
                dsl.selectOne()
                        .from(PARTICIPATION)
                        .where(PARTICIPATION.EVENT_ID.eq(eventId))
                        .and(PARTICIPATION.GUEST_ID.eq(participantId))
        );
    }

    @Override
    public Integer addParticipant(Participant participant) {
        return dsl.insertInto(PARTICIPATION, PARTICIPATION.EVENT_ID, PARTICIPATION.GUEST_ID, PARTICIPATION.AMOUNT, PARTICIPATION.CREATE_AT)
                .values(participant.eventId(), participant.guestId(), participant.amount(), LocalDateTime.now())
                .execute();
    }

    @Override
    public Integer updateParticipant(Participant participant) {

        int result = dsl.update(PARTICIPATION)
                .set(PARTICIPATION.AMOUNT, participant.amount())
                .where(PARTICIPATION.GUEST_ID.eq(participant.guestId()))
                .and(PARTICIPATION.EVENT_ID.eq(participant.eventId()))
                .execute();

        Assert.isTrue(result==1, "참가자 업데이트 실패");
        return result;
    }

    @Override
    public Integer deleteParticipant(Participant participant) {
        int result=dsl.delete(PARTICIPATION)
                .where(PARTICIPATION.EVENT_ID.eq(participant.eventId()))
                .and(PARTICIPATION.GUEST_ID.eq(participant.guestId()))
                .execute();

        Assert.isTrue(result==1, "참가자 삭제 실패");
        return result;
    }

    @Override
    public Boolean isPhoneNumber(String phoneNumber, Integer userId) {
        return dsl.fetchExists(
                dsl.selectOne()
                        .from(GUEST)
                        .join(USERS_RELATION)
                        .on(GUEST.ID.eq(USERS_RELATION.GUEST_ID))
                        .where(USERS_RELATION.USERS_ID.eq(userId))
                        .and(GUEST.PHONE_NUMBER.eq(phoneNumber))
        );
    }

    @Override
    public Integer addGuests(String name, String category, String phoneNumber) {
        Record1<Integer> saveGuest = dsl.insertInto(GUEST, GUEST.NAME, GUEST.CATEGORY, GUEST.PHONE_NUMBER, GUEST.CREATE_AT)
                .values(name, category, phoneNumber, LocalDateTime.now())
                .returningResult(GUEST.ID)
                .fetchOne();

        return saveGuest.getValue(GUEST.ID);
    }

    @Override
    public Integer addUserRelation(Integer guestId, Integer userId) {
        return dsl.insertInto(USERS_RELATION, USERS_RELATION.USERS_ID, USERS_RELATION.GUEST_ID, USERS_RELATION.CREATE_AT)
                .values(userId, guestId, LocalDateTime.now())
                .execute();
    }

    @Transactional(readOnly = true)
    @Override
    public PageResponse<UserRelation> getUserRelations(Integer userId, PageDto pageDto) {
        int size = pageDto.getSize();
        int page = pageDto.getPage();

        Integer count = dsl.selectCount()
                .from(USERS_RELATION)
                .join(GUEST)
                .on(USERS_RELATION.GUEST_ID.eq(GUEST.ID))
                .where(USERS_RELATION.USERS_ID.eq(userId))
                .fetchOne(0, Integer.class);

        int totalItems = (count != null) ? count : 0;
        int totalPages = (int) Math.ceil((double) totalItems/size);

        int offset = (page-1) * size;

        List<UserRelation> result = dsl.select(USERS_RELATION.GUEST_ID, GUEST.NAME, GUEST.CATEGORY, GUEST.PHONE_NUMBER)
                .from(USERS_RELATION)
                .join(GUEST)
                .on(USERS_RELATION.GUEST_ID.eq(GUEST.ID))
                .where(USERS_RELATION.USERS_ID.eq(userId))
                .orderBy(GUEST.NAME.asc())
                .limit(size)
                .offset(offset)
                .fetchInto(UserRelation.class);

        return new PageResponse<>(result, page, totalItems, totalPages);
    }

    @Override
    public PageResponse<UserRelation> getCategoryUserRelation(Integer userId, String category, PageDto pageDto) {
        int size = pageDto.getSize();
        int page = pageDto.getPage();

        Integer count = dsl.selectCount()
                .from(USERS_RELATION)
                .join(GUEST)
                .on(USERS_RELATION.GUEST_ID.eq(GUEST.ID))
                .where(USERS_RELATION.USERS_ID.eq(userId))
                .and(GUEST.CATEGORY.like(category))
                .fetchOne(0, Integer.class);

        int totalItems = (count != null) ? count : 0;
        int totalPages = (int) Math.ceil((double) totalItems/size);

        int offset = (page-1) * size;

        List<UserRelation> result = dsl.select(USERS_RELATION.GUEST_ID, GUEST.NAME, GUEST.CATEGORY, GUEST.PHONE_NUMBER)
                .from(USERS_RELATION)
                .join(GUEST)
                .on(USERS_RELATION.GUEST_ID.eq(GUEST.ID))
                .where(USERS_RELATION.USERS_ID.eq(userId))
                .and(GUEST.CATEGORY.like(category))
                .orderBy(GUEST.NAME.asc())
                .limit(size)
                .offset(offset)
                .fetchInto(UserRelation.class);

        return new PageResponse<>(result, page, totalItems, totalPages);
    }

}
