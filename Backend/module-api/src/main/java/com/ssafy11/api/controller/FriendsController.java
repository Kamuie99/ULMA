package com.ssafy11.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy11.api.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/relation")
public class FriendsController {

	private final UserService userService;

	@DeleteMapping("/{guestId}")
	public ResponseEntity<?> deleteRelation(@AuthenticationPrincipal User user,
		@PathVariable("guestId") Integer guestId) {
		Assert.notNull(guestId, "guestId must not be null");
		this.userService.deleteUserRelation(Integer.parseInt(user.getUsername()), guestId);
		return ResponseEntity.ok().build();
	}
}
