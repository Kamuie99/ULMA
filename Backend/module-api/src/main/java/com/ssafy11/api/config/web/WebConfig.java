package com.ssafy11.api.config.web;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class WebConfig {

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

}
