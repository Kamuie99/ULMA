package com.ssafy11.domain.common;

import lombok.Data;

@Data
public class PageDto {
    private int size=10;
    private int page=1;
}
