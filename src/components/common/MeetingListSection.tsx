import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import type { GetMeetingsParams } from "@/api/meeting.api";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";
import MeetingList from "@/components/common/MeetingList";
import { Skeleton } from "../ui/skeleton";

interface MeetingListSectionProps {
  title: string;
  queryOptions: GetMeetingsParams;
  seeMoreHref: string;
}

function MeetingListSection({
  title,
  queryOptions,
  seeMoreHref,
}: MeetingListSectionProps) {
  const { nickname } = useAuthStore();
  const {
    data: meetingsResponse,
    isLoading,
    isError,
  } = useMeetingsQuery(queryOptions);

  const meetings = meetingsResponse?.data || [];
  const safeNickname = nickname || "예비 모이머";
  const finalTitle = title.replace("{nickname}", safeNickname);

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex justify-between w-full mb-4">
        <div className="text-xl font-bold">{finalTitle}</div>
        <Link to={seeMoreHref} className="text-sm cursor-pointer">
          전체보기
        </Link>
      </div>
      {isLoading && (
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="w-48 h-60 rounded-lg" />
          ))}
        </div>
      )}
      {isError && (
        <p className="text-center text-red-500">
          모임을 불러오는 중 에러가 발생했습니다.
        </p>
      )}
      {!isLoading && !isError && meetings.length > 0 && (
        <MeetingList meetings={meetings} />
      )}
      {!isLoading && !isError && meetings.length === 0 && (
        <p className="text-center py-16">모임이 없습니다.</p>
      )}
    </div>
  );
}

export default MeetingListSection;
