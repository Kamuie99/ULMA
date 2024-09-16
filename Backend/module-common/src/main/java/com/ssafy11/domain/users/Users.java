package com.ssafy11.domain.users;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Users {
	private Integer id;
	private String loginId;
	@Email
	private String email;
	private String password;
	private String phoneNumber;
	private String account;
	private String accountNumber;
	private String name;
	private LocalDateTime createdAt;
	private String refreshToken;
}
