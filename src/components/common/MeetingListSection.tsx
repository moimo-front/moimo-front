import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import type { GetMeetingsParams } from "@/api/meeting.api";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";
import MeetingList from "@/components/common/MeetingList";

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
  const finalTitle = title.replace("{nickname}", nickname || "");

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex justify-between w-full mb-4">
        <div className="text-xl font-bold">{finalTitle}</div>
        <Link to={seeMoreHref} className="text-sm cursor-pointer">
          전체보기
        </Link>
      </div>
      {isLoading && <p className="text-center">로딩 중...</p>}
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
