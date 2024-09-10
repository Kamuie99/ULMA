package com.ssafy11.api.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.ssafy11.api.config.sms.SmsSender;
import com.ssafy11.api.config.util.VerificationUtil;
import com.ssafy11.api.dto.Mail;
import com.ssafy11.api.dto.MailVerification;
import com.ssafy11.api.dto.SmsVerification;
import com.ssafy11.api.dto.UserJoinRequest;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.users.UserCommand;
import com.ssafy11.domain.users.UserDao;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthService {

	private final SmsSender smsSender;
	private final JavaMailSender mailSender;
	private final RedisTemplate<String, Object> redisTemplate;
	private final UserDao userDao;
	private final PasswordEncoder passwordEncoder;

	public boolean isRegisterdNumber(final String phoneNumber) {
		Assert.notNull(phoneNumber, "phoneNumber must not be null");
		return this.userDao.existsByPhoneNumber(phoneNumber);
	}

	public void sendSms(final String phoneNumber) {
		Assert.notNull(phoneNumber, "phoneNumber must not be null");
		if(isRegisterdNumber(phoneNumber)) {
			throw new ErrorException(ErrorCode.Duplicated);
		}

		String smsCode = VerificationUtil.generateSmsCode();
		this.redisTemplate.opsForValue().set(phoneNumber, new SmsVerification(phoneNumber, smsCode, false));
		this.smsSender.sendSms(phoneNumber, smsCode);
	}

	public boolean verifySmsCode(final String phoneNumber, final String smsCode) {
		Assert.notNull(phoneNumber, "phoneNumber must not be null");
		Assert.notNull(smsCode, "smsCode must not be null");
		SmsVerification verification = (SmsVerification) this.redisTemplate.opsForValue().get(phoneNumber);

		if(verification == null) {
			throw new ErrorException(ErrorCode.NotFound);
		}

		if(verification.verificationCode().equals(smsCode)) {
			this.redisTemplate.delete(phoneNumber);
			this.redisTemplate.opsForValue().set(phoneNumber, new SmsVerification(phoneNumber, smsCode, true));
			return true;
		}
		return false;
	}

	public boolean isRegisterdEmail(final String email) {
		Assert.notNull(email, "email must not be null");
		return this.userDao.existsByEmail(email);
	}

	public void sendEmail(final String email) {
		Assert.notNull(email, "email must not be null");
		if(isRegisterdEmail(email)) {
			throw new ErrorException(ErrorCode.Duplicated);
		}

		String mailCode = VerificationUtil.generateMailCode();
		this.redisTemplate.opsForValue().set(email, new MailVerification(email, mailCode, false));
		this.mailSender.send(Mail.of(email, "얼마줬노 인증 메일", mailCode));
	}

	public boolean verifyMailCode(final String email, final String mailCode) {
		Assert.notNull(email, "email must not be null");
		Assert.notNull(mailCode, "mailCode must not be null");
		MailVerification verification = (MailVerification) this.redisTemplate.opsForValue().get(email);

		if(verification == null) {
			throw new ErrorException(ErrorCode.NotFound);
		}

		if(verification.verificationCode().equals(mailCode)) {
			this.redisTemplate.delete(email);
			this.redisTemplate.opsForValue().set(email, new MailVerification(email, mailCode, true));
			return true;
		}
		return false;
	}

	public boolean isRegisterdLoginId(final String loginId) {
		Assert.notNull(loginId, "loginId must not be null");
		return this.userDao.existsByLoginId(loginId);
	}

	public Integer join(UserJoinRequest request) {
		Assert.notNull(request, "request must not be null");

		if(isRegisterdLoginId(request.loginId())) {
			throw new ErrorException(ErrorCode.Duplicated);
		}

		if(isRegisterdEmail(request.email())) {
			throw new ErrorException(ErrorCode.Duplicated);
		}

		if(isRegisterdNumber(request.phoneNumber())) {
			throw new ErrorException(ErrorCode.Duplicated);
		}

		if(!request.password().equals(request.passwordConfirm())) {
			throw new ErrorException(ErrorCode.PasswordMismatch);
		}

		return this.userDao.save(UserCommand.builder()
			.name(request.name())
			.loginId(request.loginId())
			.password(passwordEncoder.encode(request.password()))
			.email(request.email())
			.phoneNumber(request.phoneNumber())
			.build());
	}
}
