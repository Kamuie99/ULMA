package com.ssafy11.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.relation.UserRelationDao;
import com.ssafy11.domain.users.UserDao;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	private UserRelationDao userRelationDao;
	private UserDao userDao;
	private UserService userService;

	@BeforeEach
	void setUp() {
		this.userRelationDao = mock(UserRelationDao.class);
		this.userDao = mock(UserDao.class);
		this.userService = new UserService(userDao, userRelationDao);
	}

	@DisplayName("삭제하려는 지인과 친구 관계가 아니라면 에러를 발생")
	@Test
	void deleteRelation() {
		// given
		Integer userId = 1;
		Integer guestId = 2;
		given(userRelationDao.hasRelation(userId, guestId)).willReturn(false);

		// expected
		assertThrows(ErrorException.class,
			() -> this.userService.deleteUserRelation(userId, guestId));
	}

	@DisplayName("삭제하려는 지인이 친구 관계라면 삭제 메소드 호출")
	@Test
	void deleteRelation_success() {
		// given
		Integer userId = 1;
		Integer guestId = 2;
		given(userRelationDao.hasRelation(userId, guestId)).willReturn(true);

		// when
		this.userService.deleteUserRelation(userId, guestId);

		// then
		verify(this.userRelationDao, times(1)).hasRelation(userId, guestId);
	}

	@DisplayName("파라미터가 null 이라면 에러를 발생")
	@Test
	void deleteRelation_parameters_not_null() {
		// given
		Integer userId = null;
		Integer guestId = null;

		// expected
		assertThrows(IllegalArgumentException.class,
			() -> this.userService.deleteUserRelation(userId, guestId));
	}
}