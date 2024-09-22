package com.ssafy11.domain.participant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

public record AddGuestResponse (String name, String category, Integer userId){
}
