package com.ssafy11;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication(scanBasePackages = "com.ssafy11")
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
