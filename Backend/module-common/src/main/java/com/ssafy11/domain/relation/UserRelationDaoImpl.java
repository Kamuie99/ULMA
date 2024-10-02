package com.ssafy11.domain.relation;

import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;
import static com.ssafy11.ulma.generated.Tables.*;


import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class UserRelationDaoImpl implements UserRelationDao {

	private final DSLContext dslContext;

	@Override
	public void deleteUserRelation(Integer userId, Integer guestId) {
		this.dslContext.update(USERS_RELATION)
			.set(USERS_RELATION.USERS_ID, (Integer) null)
			.where(USERS_RELATION.USERS_ID.eq(userId)
				.and(USERS_RELATION.GUEST_ID.eq(guestId)))
			.execute();
	}

	@Override
	public boolean hasRelation(Integer userId, Integer guestId) {
		return this.dslContext.fetchExists(
			this.dslContext.selectOne()
				.from(USERS_RELATION)
				.where(USERS_RELATION.USERS_ID.eq(userId))
				.and(USERS_RELATION.GUEST_ID.eq(guestId))
		);
	}
}
