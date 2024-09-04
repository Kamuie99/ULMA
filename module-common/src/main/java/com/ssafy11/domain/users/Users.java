package com.ssafy11.domain.users;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Users {
	private Integer id;
	private String email;
	private String password;
	private Account account;
	private String name;
	private LocalDateTime createdAt;
}
