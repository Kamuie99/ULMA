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

	// 회원
	PasswordMismatch(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),

	// GPT
	GPT_API_REQUEST_FAILED(HttpStatus.SERVICE_UNAVAILABLE, "Gpt Api를 호출에 실패했습니다."),

	// Excel
	EXCEL_PARSING_FAILED(HttpStatus.BAD_REQUEST,"엑셀 파싱에 실패했습니다."),
	NOT_EXCEL(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "파일 형식을 확인해주세요."),
	NO_CONTENT(HttpStatus.NO_CONTENT, "파일 내용을 확인해주세요."),
	ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "일치하는 계좌가 없습니다."),
	ALREADY_EXIST_PAY_ACCOUNT(HttpStatus.CONFLICT, "페이 계좌가 이미 존재합니다."),
	LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "1회 송금 한도는 200만원까지입니다."),
	USER_MISSMATCH(HttpStatus.BAD_REQUEST, "요청하신 계좌가 사용자 정보와 일치하지 않습니다."),
	NEGATIVE_VALUE_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "음수 값은 들어갈 수 없습니다."),
	INVALID_DATE_RANGE(HttpStatus.BAD_REQUEST, "시작 날짜는 종료 날짜보다 이전이어야 합니다.");

	private final HttpStatus status;
	private final String message;

}
