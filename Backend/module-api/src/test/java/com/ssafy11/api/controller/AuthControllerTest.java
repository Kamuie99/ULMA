package com.ssafy11.api.controller;

import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy11.api.config.sms.SmsSender;
import com.ssafy11.api.config.util.VerificationUtil;
import com.ssafy11.api.dto.JwtResponse;
import com.ssafy11.api.dto.MailVerification;
import com.ssafy11.api.dto.MailVerificationRequest;
import com.ssafy11.api.dto.SmsVerification;
import com.ssafy11.api.dto.SmsVerificationRequest;
import com.ssafy11.api.dto.UserJoinRequest;
import com.ssafy11.api.dto.UserLoginRequest;
import com.ssafy11.api.service.AuthService;
import com.ssafy11.domain.users.UserDao;

@ControllerTest
@WebMvcTest(controllers = {AuthController.class})
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private SmsSender smsSender;

	@MockBean
	private JavaMailSender javaMailSender;

	@MockBean
	private UserDao userDao;

	@SpyBean
	private RedisTemplate<String, Object> redisTemplate;

	@SpyBean
	private AuthService authService;

	@AfterEach
	void tearDown() throws Exception {
		this.redisTemplate.delete("01012345678");
		this.redisTemplate.delete("test@test.com");
	}

	@DisplayName("휴대폰 인증 요청을 하면 SMS가 발송된다")
	@Test
	void getSmsCode_success() throws Exception {
		// given
		String phoneNumber = "01012345678";
		given(authService.isRegisterdNumber(anyString())).willReturn(false);

		// when
		ResultActions resultActions = this.mockMvc.perform(post("/api/auth/phone")
			.contentType(MediaType.APPLICATION_JSON)
			.content("{\"phoneNumber\": \"" + phoneNumber + "\"}"));

		// then
		resultActions.andExpect(status().isOk());
		verify(authService, times(1)).sendSms(any());
	}

	@DisplayName("등록된 번호에 대해 휴대폰 인증 요청을 하면 실패한다")
	@Test
	void getSmsCode_fail() throws Exception {
		// given
		String phoneNumber = "01012345678";
		given(authService.isRegisterdNumber(anyString())).willReturn(true);

		// when
		ResultActions resultActions = this.mockMvc.perform(post("/api/auth/phone")
			.contentType(MediaType.APPLICATION_JSON)
			.content("{\"phoneNumber\": \"" + phoneNumber + "\"}"));

		// then
		resultActions.andExpect(status().isConflict());
		verify(authService, times(1)).sendSms(any());
	}

	@DisplayName("휴대폰 인증이 성공한다")
	@Test
	void verifySmsCode_success() throws Exception {
		// given
		String phoneNumber = "01012345678";
		String smsCode = VerificationUtil.generateSmsCode();
		SmsVerification smsVerification = new SmsVerification(phoneNumber, smsCode, false);
		this.redisTemplate.opsForValue().set(phoneNumber, smsVerification);

		SmsVerificationRequest request = new SmsVerificationRequest(phoneNumber, smsCode);

		// when
		ResultActions resultActions = this.mockMvc.perform(put("/api/auth/phone")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(request)));

		// then
		resultActions.andExpect(status().isOk());
	}

	@DisplayName("휴대폰 인증번호가 다르면 인증이 실패한다")
	@Test
	void verifySmsCode_fail() throws Exception {
		// given
		String phoneNumber = "01012345678";
		String smsCode = VerificationUtil.generateSmsCode();
		SmsVerification smsVerification = new SmsVerification(phoneNumber, smsCode, false);
		this.redisTemplate.opsForValue().set(phoneNumber, smsVerification);

		SmsVerificationRequest request = new SmsVerificationRequest(phoneNumber, "incorrect");

		// when
		ResultActions resultActions = this.mockMvc.perform(put("/api/auth/phone")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(request)));

		// then
		resultActions.andExpect(status().isBadRequest());
	}

	@DisplayName("존재하지 않는 번호에 대한 휴대폰 인증은 실패한다")
	@Test
	void verifySmsCode_fail_notExists() throws Exception {
		// given
		String phoneNumber = "01012345678";
		String smsCode = VerificationUtil.generateSmsCode();

		SmsVerificationRequest request = new SmsVerificationRequest(phoneNumber, smsCode);

		// when
		ResultActions resultActions = this.mockMvc.perform(put("/api/auth/phone")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(request)));

		// then
		resultActions.andExpect(status().isNotFound());
	}

	@DisplayName("메일 인증 요청을 하면 메일이 발송된다")
	@Test
	void getEmailCode_success() throws Exception {
		// given
		String email = "test@test.com";
		given(authService.isRegisterdEmail(anyString())).willReturn(false);

		// when
		ResultActions resultActions = this.mockMvc.perform(post("/api/auth/email")
			.contentType(MediaType.APPLICATION_JSON)
			.content("{\"email\": \"" + email + "\"}"));

		// then
		resultActions.andExpect(status().isOk());
		verify(authService, times(1)).sendJoinEmail(any());
	}

	@DisplayName("등록된 이메일에 대해 메일 인증 요청을 하면 실패한다")
	@Test
	void getEmailCode_fail() throws Exception {
		// given
		String email = "test@test.com";
		given(authService.isRegisterdEmail(anyString())).willReturn(true);

		// when
		ResultActions resultActions = this.mockMvc.perform(post("/api/auth/email")
			.contentType(MediaType.APPLICATION_JSON)
			.content("{\"email\": \"" + email + "\"}"));

		// then
		resultActions.andExpect(status().isConflict());
		verify(authService, times(1)).sendJoinEmail(any());
	}

	@DisplayName("메일 인증이 성공한다")
	@Test
	void verifyEmailCode_success() throws Exception {
		// given
		String email = "test@test.com";
		String mailCode = VerificationUtil.generateMailCode();
		MailVerification verification = new MailVerification(email, mailCode, false);
		this.redisTemplate.opsForValue().set(email, verification);

		MailVerificationRequest request = new MailVerificationRequest(email, mailCode);

		// when
		ResultActions resultActions = this.mockMvc.perform(put("/api/auth/email")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(request)));

		// then
		resultActions.andExpect(status().isOk());
	}

	@DisplayName("메일 인증번호가 다르면 인증이 실패한다")
	@Test
	void verifyEmailCode_fail() throws Exception {
		// given
		String email = "test@test.com";
		String mailCode = VerificationUtil.generateMailCode();
		MailVerification verification = new MailVerification(email, mailCode, false);
		this.redisTemplate.opsForValue().set(email, verification);

		MailVerificationRequest request = new MailVerificationRequest(email, "incorrect");

		// when
		ResultActions resultActions = this.mockMvc.perform(put("/api/auth/email")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(request)));

		// then
		resultActions.andExpect(status().isBadRequest());
	}

	@DisplayName("존재하지 않는 메일에 대한 메일 인증은 실패한다")
	@Test
	void verifyEmailCode_fail_notExists() throws Exception {
		// given
		String email = "test@test.com";
		String mailCode = VerificationUtil.generateMailCode();

		MailVerificationRequest request = new MailVerificationRequest(email, mailCode);

		// when
		ResultActions resultActions = this.mockMvc.perform(put("/api/auth/email")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(request)));

		// then
		resultActions.andExpect(status().isNotFound());
	}

	@DisplayName("로그인 아이디 중복체크가 성공한다")
	@Test
	void existsByLoginId() throws Exception {
		// given
		String loginId = "test";
		given(this.authService.isRegisterdLoginId(loginId)).willReturn(true);

		// when
		ResultActions resultActions = this.mockMvc.perform(get("/api/auth/loginId")
			.param("loginId", loginId));

		// then
		resultActions.andExpect(status().isOk());
	}

	@DisplayName("회원가입이 성공한다")
	@Test
	void join_success() throws Exception {
		// given
		UserJoinRequest request = UserJoinRequest.builder()
			.name("test")
			.email("test@test.com")
			.password("password")
			.passwordConfirm("password")
			.phoneNumber("01012345678")
			.loginId("test")
			.build();
		doReturn(1).when(this.authService).join(any());

		// when
		ResultActions resultActions = this.mockMvc.perform(post("/api/auth/join")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(request)));

		// then
		resultActions.andExpect(status().isOk());
	}

	@DisplayName("아이디, 패스워드가 일치하면 로그인이 성공한다")
	@Test
	void login_success() throws Exception {
		// given
		String loginId = "test";
		String password = "password";
		UserLoginRequest loginRequest = new UserLoginRequest(loginId, password);
		JwtResponse jwtResponse = new JwtResponse("accessToken", "refreshToken");
		doReturn(jwtResponse).when(this.authService).login(any());

		// when
		ResultActions resultActions = this.mockMvc.perform(post("/api/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(this.objectMapper.writeValueAsString(loginRequest)));

		// then
		resultActions.andExpect(status().isOk())
			.andExpect(jsonPath("accessToken").exists())
			.andExpect(jsonPath("refreshToken").exists());
	}

	@DisplayName("리프레시 토큰이 정상적이면 엑세스 토큰을 재발급한다")
	@Test
	void getAccessToken_success() throws Exception {
		// given
		String refreshToken = "refreshToken";
		JwtResponse jwtResponse = new JwtResponse("accessToken", "refreshToken");
		doReturn(jwtResponse).when(this.authService).getAccessToken(any());

		// when
		ResultActions resultActions = this.mockMvc.perform(post("/api/auth/accessToken")
			.header("Authorization", "Bearer " + refreshToken));

		// then
		resultActions.andExpect(status().isOk())
			.andExpect(jsonPath("accessToken").exists())
			.andExpect(jsonPath("refreshToken").exists());
	}
}