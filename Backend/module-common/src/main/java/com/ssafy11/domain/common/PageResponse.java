package com.ssafy11.domain.common;

import lombok.Builder;

import java.util.List;
@Builder
public record PageResponse<T>(
        List<T> data,
        int currentPage,
        int totalItemsCount,
        int totalPages
) {}
