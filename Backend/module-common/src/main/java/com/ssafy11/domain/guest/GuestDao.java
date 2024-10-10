package com.ssafy11.domain.guest;

import java.util.Optional;

public interface GuestDao {
    Integer updateGuest(Guest guest);
    String isGuestPhoneNumber(Integer guestId, String phoneNumber);
    Optional<Guest> getGuestById(Integer guestId);
}
