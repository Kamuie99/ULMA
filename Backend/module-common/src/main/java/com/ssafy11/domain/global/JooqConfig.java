package com.ssafy11.domain.global;

import javax.sql.DataSource;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.conf.Settings;
import org.jooq.impl.DSL;
import org.jooq.impl.DefaultConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JooqConfig {

	@Autowired
	private DataSource dataSource;

	@Bean
	public DefaultConfiguration defaultConfiguration() {
		DefaultConfiguration configuration = new DefaultConfiguration();
		configuration.setDataSource(dataSource);
		configuration.setSQLDialect(SQLDialect.MYSQL);
		configuration.set(new QueryLogger());
		configuration.set(new Settings().withRenderFormatted(true));
		return configuration;
	}

	@Bean
	public DSLContext dslContext(DefaultConfiguration defaultConfiguration) {
		return DSL.using(defaultConfiguration);
	}
}
