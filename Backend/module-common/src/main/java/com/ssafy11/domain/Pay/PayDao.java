package com.ssafy11.domain.Pay;

import com.ssafy11.domain.Account.Account;

public interface PayDao {
    Account createPayAccount(Integer userId, PayAccount account);
}
