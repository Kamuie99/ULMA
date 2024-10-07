package com.ssafy11.api.service;

import com.ssafy11.domain.guest.Guest;
import com.ssafy11.domain.guest.GuestDao;
import com.ssafy11.domain.participant.ParticipantDao;
import com.ssafy11.domain.schedule.ScheduleDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
@RequiredArgsConstructor
@Transactional
public class GuestService {
    private final GuestDao guestDao;
    private final ScheduleDao scheduleDao;
    private final ParticipantDao participantDao;

    public Integer updateGuest(Guest guest, String userId){
        Assert.isTrue(scheduleDao.isMyGuest(Integer.parseInt(userId), guest.getGuestId()), "지인 관계가 아닙니다.");
        if(!guestDao.isGuestPhoneNumber(guest.getGuestId(), guest.getGuestNumber()).equals(guest.getGuestNumber())){
            Assert.isTrue(!participantDao.isPhoneNumber(guest.getGuestNumber(), Integer.parseInt(userId)), "중복되는 휴대폰 번호가 존재합니다.");
        }
        return guestDao.updateGuest(guest);
    }
}
