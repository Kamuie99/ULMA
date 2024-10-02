package com.ssafy11.api.service;

import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.relation.UserRelationDao;
import com.ssafy11.domain.users.UserDao;
import com.ssafy11.domain.users.dto.UserInfoRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
	private final UserDao userDao;
	private final UserRelationDao userRelationDao;

	@Transactional(readOnly = true)
	public UserInfoRequest getUserInfo(String userId) {
		Assert.hasText(userId, "userId must not be empty");
		return userDao.getUserInfo(Integer.parseInt(userId))
			.orElseThrow(() -> new ErrorException(ErrorCode.NotFound));
	}

	public void deleteUserRelation(final Integer userId, final Integer guestId) {
		Assert.notNull(userId, "userId must not be null");
		Assert.notNull(guestId, "guestId must not be null");

		boolean hasRelation = this.userRelationDao.hasRelation(userId, guestId);

		if (!hasRelation) {
			throw new ErrorException(ErrorCode.BadRequest);
		}

		this.userRelationDao.deleteUserRelation(userId, guestId);
	}
}
