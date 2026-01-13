import { useEffect, useState } from "react";
import MeetingList from "@/components/common/MeetingList";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import { usePagination } from "@/hooks/usePagination";
import { useMeetingFilter } from "@/hooks/useMeetingFilter";
import { MeetingFilterControls } from "@/components/features/meetings/MeetingFilterControls";
import type {
  FinishedFilterType,
  InterestFilterType,
  SortType,
} from "@/api/meeting.api";

const MeetingsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const {
    filters,
    handleSortChange,
    handleInterestFilterChange,
    handleFinishedFilterChange,
  } = useMeetingFilter();

  const onFilterChange = <T extends SortType | InterestFilterType | FinishedFilterType>(
    updater: (value: T) => void,
    value: T
  ) => {
    updater(value);
    setPage(1);
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

  const {
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isFirstPage,
    isLastPage,
  } = usePagination({
    page,
    setPage,
    limit,
    totalCount: meetingsResponse?.meta?.totalCount ?? 0,
    apiTotalPages: meetingsResponse?.meta?.totalPages ?? 1,
  });

  const meetings = meetingsResponse?.data || [];

  return (
    <div className="space-y-4 bg-card">
      <h1 className="text-3xl font-bold p-4">원하는 모임 찾기</h1>

      <MeetingFilterControls
        filters={filters}
        interestsData={interestsData}
        isInterestsLoading={isInterestsLoading}
        handleSortChange={(v) => onFilterChange(handleSortChange, v)}
        handleInterestFilterChange={(v) =>
          onFilterChange(handleInterestFilterChange, v)
        }
        handleFinishedFilterChange={(v) =>
          onFilterChange(handleFinishedFilterChange, v)
        }
      />

      {isLoading && <p className="text-center">로딩 중...</p>}
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
