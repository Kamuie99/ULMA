package com.ssafy11.domain.users;

import static com.ssafy11.ulma.generated.Tables.*;

import java.time.LocalDateTime;
import java.util.Optional;

import com.ssafy11.domain.users.dto.UserInfoRequest;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Repository
public class UserDaoImpl implements UserDao {

	private final DSLContext dsl;

	@Transactional
	@Override
	public Integer save(UserCommand command) {
		Record1<Integer> one = dsl.insertInto(
				USERS,
				USERS.LOGIN_ID,
				USERS.EMAIL,
				USERS.PASSWORD,
				USERS.NAME,
				USERS.PHONE_NUMBER,
				USERS.BIRTHDATE,
				USERS.GENDER,
				USERS.CREATED_AT)
			.values(command.loginId(), command.email(), command.password(), command.name(), command.phoneNumber(), command.birthday(), String.valueOf(command.gender()), LocalDateTime.now())
			.returningResult(USERS.ID)
			.fetchOne();

		return one.getValue(USERS.ID);
	}

	@Override
	public boolean existsByPhoneNumber(String phoneNumber) {
		return dsl.fetchExists(
			dsl.selectOne()
				.from(USERS)
				.where(USERS.PHONE_NUMBER.eq(phoneNumber))
		);
	}

	@Override
	public boolean existsByEmail(String email) {
		return dsl.fetchExists(
			dsl.selectOne()
				.from(USERS)
				.where(USERS.EMAIL.eq(email))
		);
	}

	@Override
	public boolean existsByLoginId(String loginId) {
		return dsl.fetchExists(
			dsl.selectOne()
				.from(USERS)
				.where(USERS.LOGIN_ID.eq(loginId))
		);
	}

	@Override
	public Optional<Users> findByLoginId(String loginId) {
		return Optional.ofNullable(dsl.selectFrom(USERS)
			.where(USERS.LOGIN_ID.eq(loginId))
			.fetchOneInto(Users.class));
	}

	@Override
	public void updateRefreshToken(String loginId, String refreshToken) {
		dsl.update(USERS)
			.set(USERS.REFRESH_TOKEN, refreshToken)
			.where(USERS.LOGIN_ID.eq(loginId))
			.execute();
	}

	@Override
	public Optional<UserInfoRequest> getUserInfo(Integer userId) {
		return Optional.ofNullable(dsl.select(USERS.LOGIN_ID, USERS.EMAIL, USERS.NAME, USERS.ACCOUNT, USERS.ACCOUNT_NUMBER, USERS.PHONE_NUMBER, USERS.GENDER, USERS.BIRTHDATE, DSL.field("TIMESTAMPDIFF(YEAR, birthdate, CURDATE())").as("age"))
                .from(USERS)
                .where(USERS.ID.eq(userId))
                .fetchOneInto(UserInfoRequest.class));
	}
}
