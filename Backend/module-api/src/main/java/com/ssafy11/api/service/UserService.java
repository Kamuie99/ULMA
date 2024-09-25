package com.ssafy11.api.service;

import com.ssafy11.domain.users.UserDao;
import com.ssafy11.domain.users.dto.UserInfoRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserDao userDao;

    @Transactional(readOnly = true)
    public UserInfoRequest getUserInfo(String userId) {
        Assert.notNull(userId, "userId is required");
        UserInfoRequest result = userDao.getUserInfo(Integer.parseInt(userId));
        Assert.notNull(result, "result must not be null");
        return result;
    }
}
