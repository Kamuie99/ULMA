package com.ssafy11.domain.participant;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.Participant;
import com.ssafy11.domain.participant.dto.Transaction;
import com.ssafy11.domain.participant.dto.UserRelation;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy11.ulma.generated.Tables.*;

@Repository
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
    public PaginatedResponse<Transaction> getTransactions(Integer userId, Integer guestId, PageDto pagedto) {
        int size = pagedto.getSize();
        int page = pagedto.getPage();

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

        return new PaginatedResponse<>(result, page, totalItems, totalPages);
    }

    @Transactional(readOnly = false)
    @Override
    public Integer addParticipant(Participant participant) {
        Integer result = dsl.insertInto(PARTICIPATION, PARTICIPATION.EVENT_ID, PARTICIPATION.GUEST_ID, PARTICIPATION.AMOUNT, PARTICIPATION.CREATE_AT)
                .values(participant.getEventId(), participant.getGuestId(), participant.getAmount(), LocalDateTime.now())
                .execute();
        return result;
    }



    @Transactional(readOnly = false)
    @Override
    public Record1<Integer> addFriends(Integer userId, Integer guestId) {
        Record1<Integer> result = dsl.insertInto(USERS_RELATION, USERS_RELATION.USERS_ID, USERS_RELATION.GUEST_ID, USERS_RELATION.CREATE_AT)
                .values(userId, guestId, LocalDateTime.now())
                .returningResult(USERS_RELATION.GUEST_ID) //차후 수정하기
                .fetchOne();
        Assert.notNull(result, "Insert operation failed, no result returned");
        return result;

    }

}
