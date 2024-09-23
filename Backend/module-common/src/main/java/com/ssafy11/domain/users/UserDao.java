package com.ssafy11.domain.users;

import java.util.Optional;

public interface UserDao {
	Integer save(UserCommand command);
	boolean existsByPhoneNumber(String phoneNumber);
	boolean existsByEmail(String email);
	boolean existsByLoginId(String loginId);
	Optional<Users> findByLoginId(String loginId);
	void updateRefreshToken(String loginId, String refreshToken);
}
