package com.ssafy11.api.config.util;

import java.security.SecureRandom;

public class VerificationUtil {

	private static final SecureRandom random = new SecureRandom();

	public static String generateSmsCode() {
		StringBuilder key = new StringBuilder();
		for( int i = 0; i < 6; i++ ) {
			key.append(random.nextInt(10));
		}
		return key.toString();
	}


	public static String generateMailCode() {
		StringBuilder key = new StringBuilder();

		for (int i = 0; i < 8; i++) {
			int index = random.nextInt(3);  // 0, 1, 2 중 하나 선택

			switch (index) {
				case 0: // 소문자
					key.append((char) (random.nextInt(26) + 'a'));
					break;
				case 1: // 대문자
					key.append((char) (random.nextInt(26) + 'A'));
					break;
				case 2: // 숫자
					key.append(random.nextInt(10));
					break;
			}
		}
		return key.toString();
	}
}
