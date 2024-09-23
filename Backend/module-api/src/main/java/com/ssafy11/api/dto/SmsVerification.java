package com.ssafy11.api.dto;


public record SmsVerification (String phoneNumber, String verificationCode, boolean isVerified){
}
