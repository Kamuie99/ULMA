package com.ssafy11.domain.users;

public interface UserDao {
	Integer save(UserCommand command);
	boolean existsByPhoneNumber(String phoneNumber);
	boolean existsByEmail(String email);
	boolean existsByLoginId(String loginId);
}
