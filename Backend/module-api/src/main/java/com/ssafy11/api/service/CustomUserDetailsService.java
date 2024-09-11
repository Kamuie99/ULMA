package com.ssafy11.api.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.users.UserDao;
import com.ssafy11.domain.users.Users;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserDao userDao;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Users user = this.userDao.findByLoginId(username)
			.orElseThrow(() -> new ErrorException(ErrorCode.NotFound));
		return User.builder()
			.username(String.valueOf(user.getId()))
			.password(user.getPassword())
			.authorities("ROLE_USER")
			.build();
	}
}
