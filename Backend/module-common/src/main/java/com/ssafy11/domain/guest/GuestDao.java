package com.ssafy11.domain.guest;

public interface GuestDao {
    Integer updateGuest(Guest guest);
    String isGuestPhoneNumber(Integer guestId, String phoneNumber);
}
