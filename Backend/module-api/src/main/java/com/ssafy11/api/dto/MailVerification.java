package com.ssafy11.api.dto;


public record MailVerification(String email, String verificationCode, boolean isVerified){
}
