package com.ssafy11.domain.participant.dto;

public record TransactionSummary(
        Integer totalGiven,
        Integer totalReceived,
        Integer totalBalance
) { }
