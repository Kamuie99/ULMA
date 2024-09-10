package com.ssafy11.domain.friends;

import com.ssafy11.domain.friends.dto.Friends;
import com.ssafy11.domain.friends.dto.Guests;
import com.ssafy11.domain.friends.dto.Transactions;
import org.jooq.Record1;

import java.util.List;

public interface FriendDao {
    List<Friends> sameFriends(Integer userId, String name);
    List<Transactions> friendParticipants(Integer userId, Integer friendId);
    Record1<Integer> addGuests(Guests guest);
    Record1<Integer> addFriends(Integer userId, Integer friendId);
}
