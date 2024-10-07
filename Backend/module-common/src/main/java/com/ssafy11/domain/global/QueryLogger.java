package com.ssafy11.domain.global;

import org.jooq.ExecuteContext;
import org.jooq.ExecuteListener;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class QueryLogger implements ExecuteListener {

	@Override
	public void renderEnd(ExecuteContext ctx) {
		log.info("Executing query: \n{}", ctx.sql());
	}
}
