package com.ssafy11.domain.Account;


import java.util.List;

public record PaginatedHistory<T> (List<T> data, int currentPage, int totalItemsCount, int totalPages) {
}
