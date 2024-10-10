package com.ssafy11.domain.users;

import java.util.Optional;

import com.ssafy11.domain.users.dto.UserAppAuthDto;

public interface UserAppDao {
	void insertUserAuth(Integer userId, String password);
	void updatePassword(Integer userId, String password);
	boolean isExists(Integer userId);
	Optional<UserAppAuthDto> findByUserId(Integer userId);
	void deleteUserAuth(Integer userId);

}
