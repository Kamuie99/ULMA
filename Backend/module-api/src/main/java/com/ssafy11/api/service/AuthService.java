package com.ssafy11.api.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.ssafy11.api.config.security.JwtProvider;
import com.ssafy11.api.config.security.KeyType;
import com.ssafy11.api.config.sms.SmsSender;
import com.ssafy11.api.config.util.VerificationUtil;
import com.ssafy11.api.dto.JwtResponse;
import com.ssafy11.api.dto.Mail;
import com.ssafy11.api.dto.MailVerification;
import com.ssafy11.api.dto.SmsVerification;
import com.ssafy11.api.dto.UserJoinRequest;
import com.ssafy11.api.dto.UserLoginRequest;
import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.domain.users.UserCommand;
import com.ssafy11.domain.users.UserDao;
import com.ssafy11.domain.users.Users;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@RequiredArgsConstructor
@Transactional
@Service
public class AuthService {

	private final SmsSender smsSender;
	private final JavaMailSender mailSender;
	private final RedisTemplate<String, Object> redisTemplate;
	private final UserDao userDao;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final JwtProvider jwtProvider;

	@Transactional(readOnly = true)
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

	@Transactional(readOnly = true)
	public boolean isRegisterdEmail(final String email) {
		Assert.notNull(email, "email must not be null");
		return this.userDao.existsByEmail(email);
	}

	public void sendJoinEmail(final String email) {
		Assert.notNull(email, "email must not be null");
		if(isRegisterdEmail(email)) {
			throw new ErrorException(ErrorCode.Duplicated);
		}

		sendEmail(email);
	}

	public void sendEmail(String email) {
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

	@Transactional(readOnly = true)
	public boolean isRegisterdLoginId(final String loginId) {
		Assert.notNull(loginId, "loginId must not be null");
		return this.userDao.existsByLoginId(loginId);
	}

	public Integer join(UserJoinRequest request) {
		Assert.notNull(request, "request must not be null");

		if(isRegisterdLoginId(request.loginId())) {
			throw new ErrorException(ErrorCode.Duplicated);
		}

//		checkEmail(request);
//		checkPhoneNumber(request);

		if(!request.password().equals(request.passwordConfirm())) {
			throw new ErrorException(ErrorCode.PasswordMismatch);
		}

		String birthDate=null;
		Character gender = null;

		if(request.genderDigit().equals("3")||request.genderDigit().equals("4")){
			birthDate = "20"+request.birthDate();
		}else if(request.genderDigit().equals("1")||request.genderDigit().equals("2")){
			birthDate = "19"+request.birthDate();
		}

		Assert.notNull(birthDate, "birthDate must not be null");
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
		LocalDate date = LocalDate.parse(birthDate, formatter);

		if(request.genderDigit().equals("2") || request.genderDigit().equals("4")) {
			gender = 'F';
		}else if(request.genderDigit().equals("1") || request.genderDigit().equals("3")) {
			gender = 'M';
		}else{
			Assert.notNull(gender, "gender must not be null");
		}

		return this.userDao.save(UserCommand.builder()
			.name(request.name())
			.loginId(request.loginId())
			.password(passwordEncoder.encode(request.password()))
			.email(request.email())
			.phoneNumber(request.phoneNumber())
			.birthday(date)
			.gender(gender)
			.build());
	}

	public static boolean isValidDate(String date) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-mm-dd");
		try{
			LocalDate.parse(date, formatter);
			return true;
		}catch(DateTimeParseException e){
			return false;
		}
	}

	public JwtResponse login(UserLoginRequest request) {
		var authenticationToken = new UsernamePasswordAuthenticationToken(request.loginId(),
			request.password());
		Authentication authenticate = this.authenticationManagerBuilder.getObject().authenticate(authenticationToken);

		SecurityContextHolder.getContext().setAuthentication(authenticate);
		String accessToken = this.jwtProvider.createToken(authenticate);
		String refreshToken = this.jwtProvider.refreshToken(authenticate);

		this.userDao.updateRefreshToken(request.loginId(), refreshToken);

		return new JwtResponse(accessToken, refreshToken);
	}

	public JwtResponse getAccessToken(final String refreshToken) {
		if(!this.jwtProvider.validateToken(refreshToken, KeyType.REFRESH)) {
			throw new ErrorException(ErrorCode.InvalidToken);
		}
		String loginId = this.jwtProvider.getLoginId(refreshToken);
		Users users = this.userDao.findByLoginId(loginId)
			.orElseThrow(() -> new ErrorException(ErrorCode.NotFound));
		if(!users.getRefreshToken().equals(refreshToken)) {
			throw new ErrorException(ErrorCode.RefreshTokenMismatch);
		}
		var authentication = new UsernamePasswordAuthenticationToken(loginId, null);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String accessToken = this.jwtProvider.createToken(authentication);
		String refreshedToken = this.jwtProvider.refreshToken(authentication);
		this.userDao.updateRefreshToken(loginId, refreshToken);

		return new JwtResponse(accessToken, refreshedToken);
	}

	private void checkPhoneNumber(UserJoinRequest request) {
		if(isRegisterdNumber(request.phoneNumber())) {
			throw new ErrorException(ErrorCode.Duplicated);
		}
		var verification = (SmsVerification) this.redisTemplate.opsForValue().get(request.phoneNumber());
		if(verification == null) {
			throw new ErrorException(ErrorCode.NotFound);
		}
		if(!verification.isVerified()) {
			throw new ErrorException(ErrorCode.BadRequest);
		}
	}

	private void checkEmail(UserJoinRequest request) {
		if(isRegisterdEmail(request.email())) {
			throw new ErrorException(ErrorCode.Duplicated);
		}
		var mailVerification = (MailVerification) this.redisTemplate.opsForValue().get(request.phoneNumber());
		if(mailVerification == null) {
			throw new ErrorException(ErrorCode.NotFound);
		}
		if(!mailVerification.isVerified()) {
			throw new ErrorException(ErrorCode.BadRequest);
		}
	}
}
