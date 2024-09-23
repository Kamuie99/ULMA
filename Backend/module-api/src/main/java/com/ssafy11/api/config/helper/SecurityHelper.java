package com.ssafy11.api.config.helper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import io.jsonwebtoken.lang.Assert;

public class SecurityHelper {

	public static Integer findCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Assert.notNull(authentication, "authentication is null");
		Assert.isTrue(authentication.isAuthenticated(), "Authentication is not authenticated");
		return Integer.parseInt(authentication.getName());
	}
}
