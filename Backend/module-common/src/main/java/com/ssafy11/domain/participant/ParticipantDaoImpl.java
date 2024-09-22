package com.ssafy11.domain.participant;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.participant.dto.Participant;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy11.ulma.generated.Tables.*;

@Repository
@Transactional
@RequiredArgsConstructor
public class ParticipantDaoImpl implements ParticipantDao {

    private final DSLContext dsl;

    @Transactional(readOnly = true)
    @Override
    public List<UserRelation> sameName(Integer userId, String name) {
        List<UserRelation> result = dsl.select(GUEST.ID, GUEST.NAME, GUEST.CATEGORY)
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

        Integer count = dsl.selectCount()
                .from(PARTICIPATION)
                .join(EVENT)
                .on(EVENT.ID.eq(PARTICIPATION.EVENT_ID))
                .where(PARTICIPATION.GUEST_ID.eq(guestId))
                .and(EVENT.USERS_ID.eq(userId))
                .fetchOne(0, Integer.class);

        int totalItems = (count != null) ? count : 0;
        int totalPages = (int) Math.ceil((double) totalItems/size);

        int offset = (page-1) * size;

        List<Transaction> result = dsl.select(PARTICIPATION.GUEST_ID,PARTICIPATION.EVENT_ID, EVENT.NAME, EVENT.DATE, PARTICIPATION.AMOUNT)
                .from(PARTICIPATION)
                .join(EVENT)
                .on(EVENT.ID.eq(PARTICIPATION.EVENT_ID))
                .where(PARTICIPATION.GUEST_ID.eq(guestId))
                .and(EVENT.USERS_ID.eq(userId))
                .limit(size)
                .offset(offset)
                .fetchInto(Transaction.class);

        return new PageResponse<>(result, page, totalItems, totalPages);
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
        Integer result = dsl.insertInto(PARTICIPATION, PARTICIPATION.EVENT_ID, PARTICIPATION.GUEST_ID, PARTICIPATION.AMOUNT, PARTICIPATION.CREATE_AT)
                .values(participant.eventId(), participant.guestId(), participant.amount(), LocalDateTime.now())
                .execute();
        return result;
    }

    @Override
    public Integer addGuests(String name, String category) {
        Record1<Integer> saveGuest = dsl.insertInto(GUEST, GUEST.NAME, GUEST.CATEGORY, GUEST.CREATE_AT)
                .values(name, category, LocalDateTime.now())
                .returningResult(GUEST.ID)
                .fetchOne();

        Assert.notNull(saveGuest.getValue(GUEST.ID), "EVENT_ID 에 null 값은 허용되지 않음");
        return saveGuest.getValue(GUEST.ID);
    }

    @Override
    public Integer addUserRelation(Integer guestId, Integer userId) {
        Integer result = dsl.insertInto(USERS_RELATION, USERS_RELATION.USERS_ID, USERS_RELATION.GUEST_ID, USERS_RELATION.CREATE_AT)
                .values(userId, guestId, LocalDateTime.now())
                .execute();
        return result;
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

        List<UserRelation> result = dsl.select(USERS_RELATION.GUEST_ID, GUEST.NAME, GUEST.CATEGORY)
                .from(USERS_RELATION)
                .join(GUEST)
                .on(USERS_RELATION.GUEST_ID.eq(GUEST.ID))
                .where(USERS_RELATION.USERS_ID.eq(userId))
                .limit(size)
                .offset(offset)
                .fetchInto(UserRelation.class);

        return new PageResponse<>(result, page, totalItems, totalPages);
    }

}
