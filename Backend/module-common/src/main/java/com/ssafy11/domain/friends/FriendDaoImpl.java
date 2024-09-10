package com.ssafy11.domain.friends;

import com.ssafy11.domain.friends.dto.Friends;
import com.ssafy11.domain.friends.dto.Guests;
import com.ssafy11.domain.friends.dto.Transactions;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy11.ulma.generated.Tables.*;

@Service
@RequiredArgsConstructor
public class FriendDaoImpl implements FriendDao {

    private final DSLContext dsl;

    @Transactional(readOnly = true)
    @Override
    public List<Friends> sameFriends(Integer userId, String name) {
        List<Friends> result = dsl.select(GUEST.ID, GUEST.NAME, GUEST.CATEGORY)
                .from(USERS)
                .join(USERS_RELATION)
                .on(USERS.ID.eq(USERS_RELATION.USERS_ID))
                .join(GUEST)
                .on(USERS_RELATION.GUEST_ID.eq(GUEST.ID))
                .where(USERS.ID.eq(userId))
                .and(GUEST.NAME.like("%"+name+"%"))
                .fetchInto(Friends.class);
        return result;
    }

    @Transactional(readOnly = true)
    @Override
    public List<Transactions> friendParticipants(Integer userId, Integer friendId) {
        List<Transactions> result = dsl.select(EVENT.NAME, PARTICIPATION.AMOUNT, EVENT.DATE, PARTICIPATION.EVENT_ID, PARTICIPATION.GUEST_ID)
                .from(PARTICIPATION)
                .join(EVENT)
                .on(EVENT.ID.eq(PARTICIPATION.EVENT_ID))
                .where(PARTICIPATION.GUEST_ID.eq(friendId))
                .fetchInto(Transactions.class);
        return result;
    }

    @Override
    public Record1<Integer> addGuests(Guests guest) {
        Record1<Integer> result = dsl.insertInto(GUEST, GUEST.NAME, GUEST.CATEGORY, GUEST.CREATE_AT)
                .values(guest.getName(), guest.getCategory(), LocalDateTime.now())
                .returningResult(GUEST.ID)
                .fetchOne();
        Assert.notNull(result.getValue(GUEST.ID), "GUEST_ID 에 null 값은 허용되지 않음");

        return result;
    }

    @Override
    public Record1<Integer> addFriends(Integer userId, Integer friendId) {
        Record1<Integer> result = dsl.insertInto(USERS_RELATION, USERS_RELATION.USERS_ID, USERS_RELATION.GUEST_ID, USERS_RELATION.CREATE_AT)
                .values(userId, friendId, LocalDateTime.now())
                .returningResult(USERS_RELATION.GUEST_ID) //차후 수정하기
                .fetchOne();
        Assert.notNull(result, "Insert operation failed, no result returned");
        return result;

    }

}
