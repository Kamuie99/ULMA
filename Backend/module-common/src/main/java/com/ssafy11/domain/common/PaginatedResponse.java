package com.ssafy11.domain.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
public class PaginatedResponse<T> {
    private List<T> data;
    private int currentPage;
    private int totalItemsCount;
    private int totalPages;
}
