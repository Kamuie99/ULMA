package com.ssafy11.domain.guest;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Guest {
	private Integer guestId;
	private String guestName;
	private String guestCategory;
	private String guestNumber;
	private LocalDateTime createAt;
}
