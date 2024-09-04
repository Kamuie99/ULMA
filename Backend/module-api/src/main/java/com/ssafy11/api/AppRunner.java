package com.ssafy11.api;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.ssafy11.domain.users.UserCommand;
import com.ssafy11.domain.users.UserDao;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class AppRunner implements ApplicationRunner {

	private final UserDao userDao;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		UserCommand userCommand = UserCommand.builder()
			.email("test1@test.com")
			.password("test")
			.name("daeho")
			.build();
		Integer save = this.userDao.save(userCommand);
		System.out.println(save);
	}
}
