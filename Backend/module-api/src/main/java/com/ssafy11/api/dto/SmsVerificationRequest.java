package com.ssafy11.api.dto;

public record SmsVerificationRequest(String phoneNumber, String verificationCode) {
}
