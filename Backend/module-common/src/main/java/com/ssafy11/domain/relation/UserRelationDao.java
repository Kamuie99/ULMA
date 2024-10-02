package com.ssafy11.domain.relation;

public interface UserRelationDao {
	void deleteUserRelation(Integer userId, Integer guestId);
	boolean hasRelation(Integer userId, Integer guestId);
}
