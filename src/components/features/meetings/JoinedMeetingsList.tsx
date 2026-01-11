import MeetingCard from "../common/MeetingCard";
import { useAuthStore } from "@/store/authStore";
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery.ts";
import type { Meeting } from "@/models/meeting.model";

function JoinedMeetingsList() {
  const { username } = useAuthStore();
  const {
    data: meetingsResponse,
    isLoading,
    isError,
  } = useMeetingsQuery({ limit: 4 });

  const meetings = meetingsResponse?.data || [];

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex justify-between w-full mb-4">
        <div className="text-xl font-bold">
          {username} 님이 가입한 모임 List
        </div>
        <div className="text-sm cursor-pointer">전체보기</div>
      </div>
      {isLoading && <p className="text-center">로딩 중...</p>}
      {isError && (
        <p className="text-center text-red-500">
          모임을 불러오는 중 에러가 발생했습니다.
        </p>
      )}
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {meetings.map((meeting: Meeting) => (
          <MeetingCard key={meeting.meetingId} meeting={meeting} />
        ))}
      </div>
    </div>
  );
}

export default JoinedMeetingsList;
