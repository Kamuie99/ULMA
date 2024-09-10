package com.ssafy11.api.config.redis;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import redis.embedded.RedisServer;

@Profile("test")
@Configuration
public class EmbeddedRedisConfig {

	private int redisPort = 6375;
	private RedisServer redisServer;

	@PostConstruct
	public void init() throws IOException {
		redisServer = new RedisServer(redisPort);
		redisServer.start();
	}

	@PreDestroy
	public void destroy() throws IOException {
		if (redisServer != null) {
			redisServer.stop();
		}
	}

}
