package com.ssafy11.api.dto;

import lombok.Builder;

@Builder
public record UserJoinRequest (String name,
							   String loginId,
							   String password,
							   String passwordConfirm,
							   String email,
							   String phoneNumber,
							   String birthDate,
							   String genderDigit){
}
