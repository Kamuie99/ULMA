package com.ssafy11.api.controller;

import com.ssafy11.api.service.GuestService;
import com.ssafy11.domain.guest.Guest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/guest")

public class GuestController {
    private final GuestService guestService;

    //지인 정보 수정
    @PatchMapping
    public ResponseEntity<Integer> updateGuest(@AuthenticationPrincipal User user,
                                               @RequestBody Guest guest){
        Assert.notNull(guest, "addGuestResponse must not be null");
        int returnId = guestService.updateGuest(guest, user.getUsername());
        return ResponseEntity.ok(returnId);
    }
}
