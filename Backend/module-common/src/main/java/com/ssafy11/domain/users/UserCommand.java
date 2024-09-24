package com.ssafy11.domain.users;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record UserCommand(
	@NotNull String loginId,
	@NotNull String email,
	@NotNull String password,
	@NotNull String name,
	@NotNull String phoneNumber,
	@NotNull LocalDate birthday,
	@NotNull Character gender) {
}
