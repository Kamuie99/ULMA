package com.ssafy11.domain.events;

import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.events.dto.Event;
import com.ssafy11.domain.common.PaginatedResponse;
import com.ssafy11.domain.participant.dto.EventParticipant;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
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
    public Integer addEvent(EventCommand event) {
        Record1<Integer> saveEvent = dsl.insertInto(EVENT, EVENT.NAME, EVENT.CATEGORY, EVENT.DATE, EVENT.USERS_ID, EVENT.CREATE_AT)
                .values(event.name(), event.category(), event.date(), event.userId(), LocalDateTime.now())
                .returningResult(EVENT.ID)
                .fetchOne();

        Assert.notNull(saveEvent.getValue(EVENT.ID), "EVENT_ID 에 null 값은 허용되지 않음");
        return saveEvent.getValue(EVENT.ID);

    }

    @Transactional(readOnly = true)
    @Override
    public PaginatedResponse<Event> getEvents(Integer userId, PageDto pageDto) {
        int size = pageDto.getSize();
        int page = pageDto.getPage();

        int totalItems = dsl.fetchCount(dsl.selectFrom(EVENT).where(EVENT.USERS_ID.eq(userId)));
        int totalPages = (int) Math.ceil((double) totalItems/size);

        int offset = (page-1) * size;

        List<Event> result = dsl.select(EVENT.ID, EVENT.NAME, EVENT.CATEGORY, EVENT.DATE)
                .from(EVENT)
                .where(EVENT.USERS_ID.eq(userId))
                .limit(size)
                .offset(offset)
                .fetchInto(Event.class);

        return new PaginatedResponse<>(result, page, totalItems, totalPages);
    }

    @Transactional(readOnly = true)
    @Override
    public PaginatedResponse<EventParticipant> getEvent(Integer eventId, PageDto pageDto) {

        int size = pageDto.getSize();
        int page = pageDto.getPage();

        Integer count = dsl.selectCount()
                .from(PARTICIPATION)
                .join(GUEST)
                .on(GUEST.ID.eq(PARTICIPATION.GUEST_ID))
                .where(PARTICIPATION.EVENT_ID.eq(eventId))
                .fetchOne(0, Integer.class);

        int totalItems = (count != null) ? count : 0;
        int totalPages = (int) Math.ceil((double) totalItems/size);

        int offset = (page-1) * size;

        List<EventParticipant> result = dsl.select(GUEST.ID,GUEST.NAME,GUEST.CATEGORY, PARTICIPATION.AMOUNT)
                .from(PARTICIPATION)
                .join(GUEST)
                .on(GUEST.ID.eq(PARTICIPATION.GUEST_ID))
                .where(PARTICIPATION.EVENT_ID.eq(eventId))
                .limit(size)
                .offset(offset)
                .fetchInto(EventParticipant.class);

        return new PaginatedResponse<>(result, page, totalItems, totalPages);
    }
}
