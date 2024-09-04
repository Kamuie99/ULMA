package com.ssafy11.domain.users;

import lombok.Builder;

@Builder
public record UserCommand(String email, String password, String name) {
}
