package com.ssafy11.api.controller;

import com.ssafy11.api.service.UserService;
import com.ssafy11.domain.users.dto.UserInfoRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")

public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserInfoRequest> getUserInfo(@AuthenticationPrincipal User user) {
        UserInfoRequest info = userService.getUserInfo(user.getUsername());
        return ResponseEntity.ok(info);
    }
}
