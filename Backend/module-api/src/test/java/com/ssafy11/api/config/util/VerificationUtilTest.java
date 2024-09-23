package com.ssafy11.api.config.util;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class VerificationUtilTest {

	@DisplayName("SMS 코드를 생성한다")
	@Test
	void generateSMSCode() {
		String smsCode = VerificationUtil.generateSmsCode();

		assertNotNull(smsCode);
		assertEquals(smsCode.length(), 6);
		assertDoesNotThrow(() -> Integer.parseInt(smsCode));
	}

	@DisplayName("Mail 코드를 생성한다")
	@Test
	void generateMailCode() {
		String mailCode = VerificationUtil.generateMailCode();

		assertNotNull(mailCode);
		assertEquals(mailCode.length(), 8);
	}

}