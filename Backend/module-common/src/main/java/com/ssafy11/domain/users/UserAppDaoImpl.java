package com.ssafy11.domain.users;

import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import static com.ssafy11.ulma.generated.Tables.*;

import java.util.Optional;

import com.ssafy11.domain.users.dto.UserAppAuthDto;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Repository
public class UserAppDaoImpl implements UserAppDao {

	private final DSLContext dslContext;

	@Transactional
	@Override
	public void insertUserAuth(Integer userId, String password) {
		this.dslContext.insertInto(USERS_AUTH, USERS_AUTH.ID, USERS_AUTH.PASSWORD)
			.values(userId, password)
			.execute();
	}

	@Transactional
	@Override
	public void updatePassword(Integer userId, String password) {
		this.dslContext.update(USERS_AUTH)
			.set(USERS_AUTH.PASSWORD, password)
			.where(USERS_AUTH.ID.eq(userId))
			.execute();
	}

	@Override
	public boolean isExists(Integer userId) {
		return this.dslContext.fetchExists(
			this.dslContext.selectOne().from(USERS_AUTH)
			.where(USERS_AUTH.ID.eq(userId))
		);
	}

	@Override
	public Optional<UserAppAuthDto> findByUserId(Integer userId) {
		return Optional.ofNullable(this.dslContext.selectFrom(USERS_AUTH)
			.where(USERS_AUTH.ID.eq(userId))
			.fetchOneInto(UserAppAuthDto.class));
	}

	@Transactional
	@Override
	public void deleteUserAuth(Integer userId) {
		this.dslContext.deleteFrom(USERS_AUTH)
			.where(USERS_AUTH.ID.eq(userId))
			.execute();
	}
}
