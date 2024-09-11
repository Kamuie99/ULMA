package com.ssafy11.api.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.MailSender;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ssafy11.api.config.security.JwtProvider;
import com.ssafy11.api.config.security.KeyType;
import com.ssafy11.api.config.sms.SmsSender;
import com.ssafy11.api.dto.JwtResponse;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.users.UserDao;
import com.ssafy11.domain.users.Users;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

	@Mock
	private SmsSender smsSender;

	@Mock
	private MailSender mailSender;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private AuthenticationManagerBuilder authenticationManagerBuilder;

	@Mock
	private JwtProvider jwtProvider;

	@Mock
	private RedisTemplate<String, Object> redisTemplate;

	@Mock
	private UserDao userDao;

	@InjectMocks
	private AuthService authService;

	@DisplayName("리프레시 토큰이 정상적이면 토큰을 재발급한다")
	@Test
	void getAccessToken_success() {
		// given
		String refreshToken = "refresh_token";
		Users users = Users.builder()
			.userId("test")
			.name("test")
			.password("test")
			.refreshToken(refreshToken)
			.build();

		given(this.jwtProvider.validateToken(refreshToken, KeyType.REFRESH)).willReturn(true);
		given(this.jwtProvider.getLoginId(refreshToken)).willReturn("test");
		given(this.userDao.findByLoginId("test")).willReturn(Optional.of(users));
		given(this.jwtProvider.createToken(any())).willReturn("access_token");
		given(this.jwtProvider.refreshToken(any())).willReturn("refresh_token");

		// when
		JwtResponse jwtResponse = this.authService.getAccessToken(refreshToken);

		// then
		assertAll(
			() -> assertThat(jwtResponse.accessToken()).isEqualTo("access_token"),
			() -> assertThat(jwtResponse.refreshToken()).isEqualTo("refresh_token"),
			() -> verify(this.userDao, times(1)).updateRefreshToken(any(), any())
		);
	}

	@DisplayName("리프레시 토큰이 일치하지 않으면 에러를 발생한다")
	@Test
	void getAccessToken_mismatch_refreshToken() {
		// given
		String refreshToken = "refresh_token";
		Users users = Users.builder()
			.userId("test")
			.name("test")
			.password("test")
			.refreshToken("different")
			.build();

		given(this.jwtProvider.validateToken(refreshToken, KeyType.REFRESH)).willReturn(true);
		given(this.jwtProvider.getLoginId(refreshToken)).willReturn("test");
		given(this.userDao.findByLoginId("test")).willReturn(Optional.of(users));

		// expect
		assertThrows(ErrorException.class, () -> this.authService.getAccessToken(refreshToken));
	}

	@DisplayName("리프레시 토큰이 유효하지 않으면 에러를 발생한다")
	@Test
	void getAccessToken_invalid_refreshToken() {
		// given
		String refreshToken = "refresh_token";

		given(this.jwtProvider.validateToken(refreshToken, KeyType.REFRESH)).willReturn(false);

		// expect
		assertThrows(ErrorException.class, () -> this.authService.getAccessToken(refreshToken));
	}

}