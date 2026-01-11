import { useState } from "react";
import MeetingList from "@/components/common/MeetingList";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery.ts";
import { usePagination } from "@/hooks/usePagination";

const MeetingsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: meetingsResponse,
    isLoading,
    isError,
  } = useMeetingsQuery({ page, limit });

  const { totalPages, goToNextPage, goToPreviousPage } = usePagination({
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

      {/* TODO: Filter section */}
      <div className="flex justify-between items-center px-4">
        <div>
          <p>카테고리 | 날짜 | 지역 | 개수</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="cursor-pointer">인기순</p>
          <p className="text-muted-foreground">|</p>
          <p className="cursor-pointer">최신순</p>
        </div>
      </div>

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
          />
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
