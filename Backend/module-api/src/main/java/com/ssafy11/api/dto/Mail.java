package com.ssafy11.api.dto;

import org.springframework.mail.SimpleMailMessage;

import lombok.Builder;

@Builder
public record Mail(String from,String to,String title,String text) {

	public static SimpleMailMessage of(String to, String title, String text) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom("ulma.e204@gmail.com");
		mailMessage.setTo(to);
		mailMessage.setSubject(title);
		mailMessage.setText(text);
		return mailMessage;
	}
}
