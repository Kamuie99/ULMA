package com.ssafy11.domain.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserAppAuthDto(@NotNull Integer userId, @NotBlank String password) {
}
