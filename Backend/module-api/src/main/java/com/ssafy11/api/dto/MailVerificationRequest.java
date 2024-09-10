package com.ssafy11.api.dto;

public record MailVerificationRequest(String email, String verificationCode) {
}
