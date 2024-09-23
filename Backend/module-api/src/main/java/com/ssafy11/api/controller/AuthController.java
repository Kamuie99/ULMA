package com.ssafy11.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy11.api.dto.JwtResponse;
import com.ssafy11.api.dto.MailRequest;
import com.ssafy11.api.dto.MailVerificationRequest;
import com.ssafy11.api.dto.PhoneNumberRequest;
import com.ssafy11.api.dto.SmsVerificationRequest;
import com.ssafy11.api.dto.UserJoinRequest;
import com.ssafy11.api.dto.UserLoginRequest;
import com.ssafy11.api.service.AuthService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/phone")
	public ResponseEntity<?> authenticatePhone(@RequestBody PhoneNumberRequest phoneNumber) {
		Assert.notNull(phoneNumber, "phoneNumber must not be null");
		this.authService.sendSms(phoneNumber.phoneNumber());
		return ResponseEntity.ok().build();
	}

	@PutMapping("/phone")
	public ResponseEntity<?> authenticatePhone(@RequestBody SmsVerificationRequest verification) {
		Assert.notNull(verification, "verification must not be null");
		boolean verified = this.authService.verifySmsCode(verification.phoneNumber(), verification.verificationCode());
		if (verified) {
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.badRequest().build();
	}

	@PostMapping("/email")
	public ResponseEntity<?> authenticateMail(@RequestBody MailRequest mailRequest) {
		Assert.notNull(mailRequest, "mailRequest must not be null");
		this.authService.sendJoinEmail(mailRequest.email());
		return ResponseEntity.ok().build();
	}

	@PutMapping("/email")
	public ResponseEntity<?> authenticationMail(@RequestBody MailVerificationRequest verification) {
		Assert.notNull(verification, "verification must not be null");
		boolean verified = this.authService.verifyMailCode(verification.email(), verification.verificationCode());
		if (verified) {
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.badRequest().build();
	}

	@GetMapping("/loginId")
	public ResponseEntity<?> existsByLoginId(@RequestParam("loginId") String loginId) {
		Assert.notNull(loginId, "loginId must not be null");
		boolean existsByLoginId = this.authService.isRegisterdLoginId(loginId);
		String response;
		if(existsByLoginId) {
			response = "존재하는 아이디입니다.";
		} else {
			response = "존재하지 않는 아이디입니다.";
		}

		return ResponseEntity.ok().body(response);
	}

	@PostMapping("/join")
	public ResponseEntity<Integer> join(@RequestBody UserJoinRequest joinRequest) {
		Assert.notNull(joinRequest, "joinRequest must not be null");

		Integer join = this.authService.join(joinRequest);
		return ResponseEntity.ok(join);
	}

	// TODO : 비밀번호 복호화 구현해야함
	@PostMapping("/login")
	public ResponseEntity<JwtResponse> login(@RequestBody UserLoginRequest loginRequest) {
		Assert.notNull(loginRequest, "loginRequest must not be null");
		JwtResponse jwtResponse  = this.authService.login(loginRequest);
		return ResponseEntity.ok(jwtResponse);
	}

	@PostMapping("/accessToken")
	public ResponseEntity<JwtResponse> getAccessToken(@RequestHeader("Authorization") String refreshToken) {
		Assert.notNull(refreshToken, "refreshToken must not be null");
		JwtResponse jwtResponse = this.authService.getAccessToken(refreshToken);
		return ResponseEntity.ok(jwtResponse);
	}


}
