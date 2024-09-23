package com.ssafy11.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class ExceptionController {

	@ExceptionHandler(ErrorException.class)
	public ResponseEntity<?> handleErrorException(ErrorException ex) {
		if(ex.getErrorCode().equals(ErrorCode.InternalServer)){
			log.warn(ex.getMessage());
		}
		return ResponseEntity.status(ex.getErrorCode().getStatus()).body(ex.getErrorCode().getMessage());
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<?> handleIllegalStateException(IllegalStateException ex) {
		log.warn(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
		log.warn(ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException ex) {
		log.warn(ex.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
	}

}
