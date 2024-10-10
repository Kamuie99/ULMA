package com.ssafy11.domain.users;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jooq.JooqTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.ssafy11.api.config.web.WebConfig;
import com.ssafy11.domain.global.JooqConfig;
import com.ssafy11.domain.users.dto.UserAppAuthDto;

@Testcontainers
@JooqTest
@Import({UserDaoImpl.class, UserAppDaoImpl.class, WebConfig.class, JooqConfig.class})
class UserAppDaoImplTest {

	@Autowired
	private UserDaoImpl userDao;
	@Autowired
	private UserAppDaoImpl userAppDao;

	private Integer savedId;

	@Container
	public static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0.33")
		.withDatabaseName("ulma")
		.withUsername("root")
		.withPassword("1234")
		.withInitScript("schema.sql");

	@DynamicPropertySource
	static void registerMySQLProperties(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
		registry.add("spring.datasource.username", mySQLContainer::getUsername);
		registry.add("spring.datasource.password", mySQLContainer::getPassword);
	}

	@BeforeEach
	void setUp() {
		this.savedId = this.userDao.save(UserCommand.builder()
			.loginId("test")
			.email("test@test.com")
			.password("password")
			.name("test")
			.phoneNumber("01000000000")
			.birthday(LocalDate.of(1996, 10, 14))
			.gender('M')
			.build()
		);
	}

	@AfterEach
	void tearDown() {
		this.userDao.deleteUser(savedId);
		this.userAppDao.deleteUserAuth(savedId);
	}

	@DisplayName("회원 앱 2차 인증번호를 저장 후 조회한다")
	@Test
	void insertInto() {
		// given
		String password = "password";

		// when
		this.userAppDao.insertUserAuth(savedId, password);

		// then
		Optional<UserAppAuthDto> byUserId = this.userAppDao.findByUserId(savedId);
		assertAll(
			() -> assertThat(byUserId).isNotEmpty(),
			() -> assertThat(byUserId.get().userId()).isEqualTo(savedId),
			() -> assertThat(byUserId.get().password()).isEqualTo(password)
		);
	}

	@DisplayName("회원 앱 인증번호를 업데이트 한다")
	@Test
	void updatePassword() {
		// given
		String password = "password";
		String updatedPassword = "updatedPassword";
		this.userAppDao.insertUserAuth(savedId, password);

		// when
		this.userAppDao.updatePassword(savedId, updatedPassword);

		// then
		Optional<UserAppAuthDto> byUserId = this.userAppDao.findByUserId(savedId);
		assertThat(byUserId).isNotEmpty();
		UserAppAuthDto userAppAuthDto = byUserId.get();
		assertThat(userAppAuthDto.password()).isEqualTo(updatedPassword);
	}

	@DisplayName("회원 인증 정보를 저장하지 않으면 조회되지 않는다")
	@Test
	void isExists_false() {
		// given
		Integer invalidId = 123125;
		// when
		boolean exists = this.userAppDao.isExists(invalidId);
		// then
		assertThat(exists).isFalse();
	}

	@DisplayName("회원 인증 정보를 저장하면 조회된다")
	@Test
	void isExists_true() {
		// given
		String password = "password";
		this.userAppDao.insertUserAuth(savedId, password);
		// when
		boolean exists = this.userAppDao.isExists(savedId);
		// then
		assertThat(exists).isTrue();
	}
}