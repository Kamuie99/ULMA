package com.ssafy11.domain.users;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UserCommand(
	@NotNull String loginId,
	@NotNull String email,
	@NotNull String password,
	@NotNull String name,
	@NotNull String phoneNumber) {
}
