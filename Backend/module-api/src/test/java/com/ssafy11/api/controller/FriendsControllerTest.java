package com.ssafy11.api.controller;

import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.ssafy11.api.exception.ErrorCode;
import com.ssafy11.api.exception.ErrorException;
import com.ssafy11.api.service.UserService;

@ControllerTest
@WebMvcTest(controllers = FriendsController.class)
class FriendsControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@MockBean
	private UserService userService;

	@WithMockUser(username = "1")
	@DisplayName("친구 관계의 지인을 삭제한다")
	@Test
	void deleteFriend() throws Exception{
		// given
		Integer userId = 1;
		Integer guestId = 2;
		doNothing().when(this.userService).deleteUserRelation(userId, guestId);

		// when
		ResultActions resultActions = this.mockMvc.perform(
			MockMvcRequestBuilders.delete("/api/relation/{guestId}", guestId));

		// then
		resultActions.andExpect(status().isOk());
	}

	@WithMockUser(username = "1")
	@DisplayName("친구 관계가 아니라면 400 상태 코드를 반환")
	@Test
	void deleteFriend_fail() throws Exception{
		// given
		Integer userId = 1;
		Integer guestId = 2;
		doThrow(new ErrorException(ErrorCode.BadRequest))
			.when(this.userService).deleteUserRelation(userId, guestId);

		// when
		ResultActions resultActions = this.mockMvc.perform(
			MockMvcRequestBuilders.delete("/api/relation/{guestId}", guestId));

		// then
		resultActions.andExpect(status().isBadRequest());
	}

}