import { useMemo } from "react";

interface UsePaginationOptions {
  page: number;
  limit: number;
  setPage: (updater: (page: number) => number) => void;
  totalCount: number;
  apiTotalPages: number;
}

export const usePagination = (options: UsePaginationOptions) => {
  const { page, limit, setPage, totalCount, apiTotalPages = 0 } = options;

  // API 응답 또는 계산을 기반으로 총 페이지 수 계산
  const totalPages = useMemo(() => {
    if (apiTotalPages > 0) {
      return apiTotalPages;
    }
    if (totalCount === 0 || limit === 0) return 1;
    return Math.ceil(totalCount / limit);
  }, [totalCount, limit, apiTotalPages]);

  const goToNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return {
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isFirstPage,
    isLastPage,
  };
};
