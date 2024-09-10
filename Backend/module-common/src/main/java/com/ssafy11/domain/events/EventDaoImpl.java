package com.ssafy11.domain.events;

import com.ssafy11.domain.events.dto.Events;
import com.ssafy11.domain.friends.dto.Friends;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.impl.DefaultDSLContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;

import static com.ssafy11.ulma.generated.Tables.*;

@RequiredArgsConstructor
@Repository
public class EventDaoImpl implements EventDao{

    private final DSLContext dsl;

    @Transactional(readOnly = false)
    @Override
    public Integer save(EventCommand event) {
        Record1<Integer> saveEvent = dsl.insertInto(EVENT, EVENT.NAME, EVENT.CATEGORY, EVENT.DATE, EVENT.USERS_ID, EVENT.CREATE_AT)
                .values(event.name(), event.category(), event.date(), event.userId(), LocalDateTime.now())
                .returningResult(EVENT.ID)
                .fetchOne();

        Assert.notNull(saveEvent.getValue(EVENT.ID), "EVENT_ID 에 null 값은 허용되지 않음");
        return saveEvent.getValue(EVENT.ID);

    }

    @Transactional(readOnly = true)
    @Override
    public List<Events> getEvents(Integer userId) {
        List<Events> result = dsl.select(EVENT.ID, EVENT.NAME, EVENT.CATEGORY, EVENT.DATE)
                .from(EVENT)
                .where(EVENT.USERS_ID.eq(userId))
                .fetchInto(Events.class);

        return result;
    }

    @Transactional(readOnly = true)
    @Override
    public List<Friends> getGuests(Integer userId, Integer eventId) {
        List<Friends> result = dsl.select()
                .from(PARTICIPATION)
                .join(GUEST)
                .on(GUEST.ID.eq(PARTICIPATION.GUEST_ID))
                .fetchInto(Friends.class);

        return result;
    }
}
