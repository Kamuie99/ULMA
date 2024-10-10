package com.ssafy11.domain.guest;

import static com.ssafy11.ulma.generated.Tables.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.jooq.DSLContext;
import org.jooq.Field;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Repository
public class GuestDaoImpl implements GuestDao {

    private final DSLContext dsl;

    @Override
    public Integer updateGuest(Guest guest) {
        Map<Field<?>, Object> updateMap = new HashMap<>();

        if(guest.getGuestName()!=null) updateMap.put(GUEST.NAME, guest.getGuestName());
        if(guest.getGuestCategory()!=null) updateMap.put(GUEST.CATEGORY, guest.getGuestCategory());
        if(guest.getGuestNumber()!=null) updateMap.put(GUEST.PHONE_NUMBER, guest.getGuestNumber());

        int result = -1;
        if(!updateMap.isEmpty()){
            result = dsl.update(GUEST)
                    .set(updateMap)
                    .where(GUEST.ID.eq(guest.getGuestId()))
                    .execute();
        }
        Assert.isTrue(result==1, "지인 업데이트 실패 데이터 정보를 확인해주세요");
        return result;
    }

    @Override
    public String isGuestPhoneNumber(Integer guestId, String phoneNumber) {
        return dsl.select(GUEST.PHONE_NUMBER)
                .from(GUEST)
                .where(GUEST.ID.eq(guestId))
                .fetchOne(GUEST.PHONE_NUMBER);
    }

    @Override
    public Optional<Guest> getGuestById(Integer guestId) {
        return Optional.ofNullable(
                dsl.select(GUEST.ID, GUEST.NAME, GUEST.CATEGORY, GUEST.PHONE_NUMBER)
                        .from(GUEST)
                        .where(GUEST.ID.eq(guestId))
                        .fetchOneInto(Guest.class)
        );
    }


}
