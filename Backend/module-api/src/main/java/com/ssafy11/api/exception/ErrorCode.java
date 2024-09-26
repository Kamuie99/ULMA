package com.ssafy11.api.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ErrorCode {
	// 공통
	NotFound(HttpStatus.NOT_FOUND, "존재하지 않습니다."),
	InvalidAccess(HttpStatus.BAD_REQUEST, "접근할 수 없는 상태입니다."),
	UserNotFound(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다."),
	ForbiddenError(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
	BadRequest(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
	IllegalArgument(HttpStatus.BAD_REQUEST, "인자 값이 잘못되었습니다."),
	Duplicated(HttpStatus.CONFLICT, "이미 등록된 정보입니다."),
	InternalServer(HttpStatus.INTERNAL_SERVER_ERROR, "잠시 후 다시 시도해주세요"),
	InvalidToken(HttpStatus.UNAUTHORIZED, "토큰이 잘못되었습니다."),
	RefreshTokenMismatch(HttpStatus.UNAUTHORIZED, "토큰이 일치하지 않습니다."),
	NotEnoughFundsException(HttpStatus.BAD_REQUEST, "잔액이 부족합니다."),
	InvalidDateRangeException(HttpStatus.BAD_REQUEST, "유효하지 않은 날짜 범위입니다. 시작 날짜가 종료 날짜보다 빠르거나 같아야 합니다."),
	AlreadyExistPay(HttpStatus.CONFLICT, "이미 생성하신 얼마페이가 있습니다."),

	// 회원
	PasswordMismatch(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다.");


	private final HttpStatus status;
	private final String message;
}
