import { useQuery } from "@tanstack/react-query";
import { getMyMeetings } from "@/api/me.api";
import { usePagination } from "./usePagination";

// 내 모임 목록 조회
export const useMeQuery = (type: 'joined' | 'hosted' | 'all', status: string = "all", page: number = 1, limit: number = 5) => {
    const queryResult = useQuery({
        queryKey: ["my-meetings", type, status, page, limit],
        queryFn: () => getMyMeetings(type, status, page, limit),
        staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 '신선한(fresh)' 상태로 간주
        gcTime: 1000 * 60 * 30, // 가비지 컬렉션 타임을 30분으로 설정하여 캐시 유지
        retry: 2, // 실패 시 재시도 횟수 제한
    });

    const { totalPages, isFirstPage, isLastPage } = usePagination({
        page,
        limit,
        totalCount: queryResult.data?.meta?.totalCount ?? 0,
        apiTotalPages: queryResult.data?.meta?.totalPages ?? 1,
    });

    return {
        ...queryResult,
        meetings: queryResult.data?.data ?? [],
        meta: queryResult.data?.meta,
        totalPages,
        isFirstPage,
        isLastPage,
    };
};