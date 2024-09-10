package com.ssafy11.api.controller;

import com.ssafy11.domain.friends.FriendService;
import com.ssafy11.domain.friends.dto.Friends;
import com.ssafy11.domain.friends.dto.Guests;
import com.ssafy11.domain.friends.dto.Transactions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final FriendService friendService;

    @Autowired
    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }
    //경조사비 추가
    //동일 이름 검증
    @GetMapping("same/{userId}")
    public ResponseEntity<?> getFriends(@PathVariable("userId") Integer userId, @RequestParam("name") String name) {
        List<Friends> friendsList = friendService.sameFriends(userId, name);
        return ResponseEntity.ok(friendsList);
    }

    //송금 내역 확인
    @GetMapping("{userId}/{friendId}")
    public ResponseEntity<?> getTransaction(@PathVariable("userId") Integer userId, @PathVariable("friendId") Integer friendId) {
        List<Transactions> transactions = friendService.FriendParticipants(userId, friendId);
        return ResponseEntity.ok(transactions);
    }

    //게스트 추가
//    @PostMapping()
//    public ResponseEntity<?> addGuests(@RequestBody Guests guest) {
//        Integer guestId
//    }

    //경조사 추가


}
