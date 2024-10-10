package com.ssafy11.api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.users.UserAppDao;
import com.ssafy11.domain.users.dto.UserAppAuthDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users/app/auth")
public class AppController {

	private final UserAppDao userAppDao;
	private final PasswordEncoder passwordEncoder;

	@PostMapping("/{userId}")
	public ResponseEntity<?> matchPassword(@PathVariable("userId") Integer userId,
		@RequestBody UserAppAuthDto userAppAuthDto, Errors errors) {
		if(errors.hasErrors()) {
			return new ResponseEntity<>(errors.getAllErrors(), HttpStatus.BAD_REQUEST);
		}
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Integer authenticatedUserId = Integer.parseInt(authentication.getName());
		if(authenticatedUserId != userId) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		UserAppAuthDto authDto = this.userAppDao.findByUserId(userId)
			.orElseThrow(() -> new ErrorException(ErrorCode.NotFound));
		boolean matches = this.passwordEncoder.matches(this.passwordEncoder.encode(userAppAuthDto.password()),
			authDto.password());
		Map<String, Boolean> result = new HashMap<>();
		result.put("isMatches", matches);
		return ResponseEntity.ok(result);
	}

	@PostMapping
	public ResponseEntity<?> insertUserAppAuth(@RequestBody UserAppAuthDto userAppAuthDto, Errors errors) {
		if(errors.hasErrors()) {
			return new ResponseEntity<>(errors.getAllErrors(), HttpStatus.BAD_REQUEST);
		}
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Integer authenticatedUserId = Integer.parseInt(authentication.getName());
		if(authenticatedUserId != userAppAuthDto.userId()) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		boolean exists = this.userAppDao.isExists(authenticatedUserId);
		if(exists) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
		this.userAppDao.insertUserAuth(authenticatedUserId, this.passwordEncoder.encode(userAppAuthDto.password()));
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{userId}")
	public ResponseEntity<?> updateUserAppAuth(@PathVariable("userId") Integer userId,
		@RequestBody UserAppAuthDto userAppAuthDto, Errors errors) {
		if(errors.hasErrors()) {
			return new ResponseEntity<>(errors.getAllErrors(), HttpStatus.BAD_REQUEST);
		}
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Integer authenticatedUserId = Integer.parseInt(authentication.getName());
		if(authenticatedUserId != userId) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		boolean exists = this.userAppDao.isExists(userId);
		if(!exists) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		this.userAppDao.updatePassword(authenticatedUserId, this.passwordEncoder.encode(userAppAuthDto.password()));
		return ResponseEntity.ok().build();
	}

}
