import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MeetingList from "@/components/common/MeetingList";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import { usePagination } from "@/hooks/usePagination";
import { useMeetingFilter } from "@/hooks/useMeetingFilter";
import { MeetingFilterControls } from "@/components/features/meetings/MeetingFilterControls";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  FinishedFilterType,
  InterestFilterType,
  SortType,
} from "@/api/meeting.api";

const MeetingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 직접 상태 읽기
  const { filters } = useMeetingFilter(searchParams);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  // URL 업데이트 로직
  const updateSearchParams = (newParams: Record<string, string>) => {
    const updated = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(newParams)) {
      updated.set(key, value);
    }
    setSearchParams(updated);
  };

  const handleFilterChange = (
    key: string,
    value: string | number | boolean
  ) => {
    updateSearchParams({ [key]: String(value), page: "1" });
  };

  const setPage = (newPage: number) => {
    updateSearchParams({ page: String(newPage) });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const {
    data: meetingsResponse,
    isLoading,
    isError,
  } = useMeetingsQuery({ page, limit, ...filters });

  // TODO: useInterestQuery 사용하기
  const interestsData = [];
  const isInterestsLoading = false;

  const { totalPages, isFirstPage, isLastPage } = usePagination({
    page,
    limit,
    totalCount: meetingsResponse?.meta?.totalCount ?? 0,
    apiTotalPages: meetingsResponse?.meta?.totalPages ?? 1,
  });

  const goToNextPage = () => {
    if (!isLastPage) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      setPage(page - 1);
    }
  };

  const meetings = meetingsResponse?.data || [];

  return (
    <div className="space-y-4 bg-card">
      <h1 className="text-3xl font-bold p-4">원하는 모임 찾기</h1>

      <MeetingFilterControls
        filters={filters}
        limit={limit}
        interestsData={interestsData}
        isInterestsLoading={isInterestsLoading}
        handleSortChange={(v: SortType) => handleFilterChange("sort", v)}
        handleInterestFilterChange={(v: InterestFilterType) =>
          handleFilterChange("interestFilter", v)
        }
        handleFinishedFilterChange={(v: FinishedFilterType) =>
          handleFilterChange("finishedFilter", v)
        }
        handleLimitChange={(v: number) => handleFilterChange("limit", v)}
      />

      {isLoading && (
        <div className="w-full max-w-6xl mx-auto py-8">
          <div className="grid grid-cols-4 gap-4 justify-items-center">
            {[...Array(limit)].map((_, index) => (
              <Skeleton key={index} className="w-48 h-60 rounded-lg" />
            ))}
          </div>
        </div>
      )}
      {isError && (
        <p className="text-center text-red-500">에러가 발생했습니다.</p>
      )}

      {!isLoading && !isError && meetings.length > 0 && (
        <MeetingList meetings={meetings} />
      )}

      {!isLoading && !isError && meetings.length === 0 && (
        <p className="text-center py-16">해당 조건의 모임이 없습니다.</p>
      )}

      <div className="py-8">
        {meetings.length > 0 && (
          <PaginationComponent
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
