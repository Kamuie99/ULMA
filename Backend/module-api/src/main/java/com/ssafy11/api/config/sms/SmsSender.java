package com.ssafy11.api.config.sms;

public interface SmsSender {
	void sendSms(String phoneNumber, String message);
}
