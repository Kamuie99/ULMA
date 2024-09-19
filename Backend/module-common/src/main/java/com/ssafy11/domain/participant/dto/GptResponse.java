package com.ssafy11.domain.participant.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GptResponse {
    private Integer userId;
    private String gptQuotes;
}
