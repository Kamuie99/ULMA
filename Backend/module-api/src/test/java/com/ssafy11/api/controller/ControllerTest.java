package com.ssafy11.api.controller;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.ssafy11.api.config.redis.EmbeddedRedisConfig;
import com.ssafy11.api.config.redis.RedisConfig;
import com.ssafy11.api.config.security.SecurityConfig;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@ActiveProfiles("test")
@Import({SecurityConfig.class, EmbeddedRedisConfig.class, RedisConfig.class})
public @interface ControllerTest {
}
