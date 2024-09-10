package com.ssafy11.api.config.sms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class CoolSmsSender implements SmsSender {

	@Value("${sms.key}")
	private String key;
	@Value("${sms.secret-key}")
	private String secretKey;
	private DefaultMessageService messageService;

	@PostConstruct
	public void init() {
		this.messageService = NurigoApp.INSTANCE.initialize(key, secretKey, "https://api.coolsms.co.kr");
	}

	@Override
	public void sendSms(String phoneNumber, String content) {
		Message message = new Message();
		message.setFrom("01032354666");
		message.setTo(phoneNumber);
		message.setText(content);

		this.messageService.sendOne(new SingleMessageSendingRequest(message));
	}
}
