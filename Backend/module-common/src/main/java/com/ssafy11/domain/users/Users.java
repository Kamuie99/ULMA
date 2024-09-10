package com.ssafy11.domain.users;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Users {
	private Integer id;
	private String userId;
	@Email
	private String email;
	private String password;
	private String phoneNumber;
	private Account account;
	private String name;
	private LocalDateTime createdAt;
}
