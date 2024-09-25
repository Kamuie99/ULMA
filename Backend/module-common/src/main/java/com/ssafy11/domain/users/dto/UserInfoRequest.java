package com.ssafy11.domain.users.dto;

import lombok.Builder;

import java.util.Date;

@Builder
public record UserInfoRequest (String email, String name, String account, String accountNumber, String phoneNumber, Character gender, Date birthDate, Integer age) {
}

