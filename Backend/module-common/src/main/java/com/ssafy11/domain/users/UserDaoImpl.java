package com.ssafy11.domain.users;

import static com.ssafy11.ulma.generated.Tables.*;

import java.time.LocalDateTime;

import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserDaoImpl implements UserDao{

	private final DSLContext dsl;

	@Transactional(readOnly = false)
	@Override
	public Integer save(UserCommand command) {
		Record1<Integer> one = dsl.insertInto(USERS, USERS.EMAIL, USERS.PASSWORD, USERS.NAME,
				USERS.CREATED_AT)
			.values(command.email(), command.password(), command.name(), LocalDateTime.now())
			.returningResult(USERS.ID)
			.fetchOne();

		Assert.notNull(one.getValue(USERS.ID), "ID 에 null 값은 허용되지 않음");
		return one.getValue(USERS.ID);
	}
}
