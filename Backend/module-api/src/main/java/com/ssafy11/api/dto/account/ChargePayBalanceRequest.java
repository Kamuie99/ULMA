package com.ssafy11.api.dto.account;

import org.jetbrains.annotations.NotNull;

public record ChargePayBalanceRequest(

        @NotNull Long balance
        
) {
}
