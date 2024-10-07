package com.ssafy11.domain.relation;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;

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
import com.ssafy11.domain.common.PageDto;
import com.ssafy11.domain.common.PageResponse;
import com.ssafy11.domain.global.JooqConfig;
import com.ssafy11.domain.participant.ParticipantDaoImpl;
import com.ssafy11.domain.participant.dto.UserRelation;
import com.ssafy11.domain.users.UserCommand;
import com.ssafy11.domain.users.UserDaoImpl;

@Testcontainers
@JooqTest
@Import({UserRelationDaoImpl.class, UserDaoImpl.class, ParticipantDaoImpl.class, WebConfig.class, JooqConfig.class})
class UserRelationDaoTest {

	@Autowired
	private UserRelationDaoImpl userRelationDao;
	@Autowired
	private UserDaoImpl userDao;
	@Autowired
	private ParticipantDaoImpl participantDao;
	private Integer savedId;
	private Integer savedGuestId;

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
	void setUp() throws Exception {

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

		this.savedGuestId = this.participantDao.addGuests("guest", "친구", "01012345678");
		this.participantDao.addUserRelation(savedGuestId, savedId);
	}

	@DisplayName("지인 삭제를 하면 사용자의 지인 목록에서 조회되지 않는다")
	@Test
	void deleteUserRelation() {
		// given
		PageResponse<UserRelation> userRelations =
			this.participantDao.getUserRelations(savedId, new PageDto());
		boolean hasMatchingGuestId = userRelations.data().stream()
			.anyMatch(relation -> relation.guestId().equals(savedGuestId));
		assertThat(hasMatchingGuestId).isTrue();

		// when
		this.userRelationDao.deleteUserRelation(savedId, savedGuestId);

		// then
		userRelations = this.participantDao.getUserRelations(savedId, new PageDto());
		hasMatchingGuestId = userRelations.data().stream()
			.anyMatch(relation -> relation.guestId().equals(savedGuestId));
		assertThat(hasMatchingGuestId).isFalse();
	}

	@DisplayName("친구 관계를 끊으면 False 을 반환")
	@Test
	void test () {
		// given
		boolean hasRelation = this.userRelationDao.hasRelation(savedId, savedGuestId);
		assertThat(hasRelation).isTrue();

		// when
		this.userRelationDao.deleteUserRelation(savedId, savedGuestId);

		// then
		hasRelation = this.userRelationDao.hasRelation(savedId, savedGuestId);
		assertThat(hasRelation).isFalse();
	}
}