package com.ssafy11.domain.friends;

import com.ssafy11.domain.friends.dto.Friends;
import com.ssafy11.domain.friends.dto.Transactions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;

@Service
public class FriendService {
    private final FriendDao friendDao;

    @Autowired
    public FriendService(FriendDao friendDao) {
        Assert.notNull(friendDao, "FriendDao is required");
        this.friendDao = friendDao;
    }

    public List<Friends> sameFriends(Integer userId, String name){
        Assert.notNull(userId, "userId is required");
        Assert.notNull(name, " name is required");
        List<Friends> friendsList = friendDao.sameFriends(userId, name);
        return friendsList != null ? friendsList : Collections.emptyList();
    }

    public List<Transactions> FriendParticipants(Integer userId, Integer friendId){
        Assert.notNull(userId, "userId is required");
        Assert.notNull(friendId, "friendId is required");
        List<Transactions> transactionsList = friendDao.friendParticipants(userId, friendId);
        return transactionsList != null ? transactionsList : Collections.emptyList();
    }


}
