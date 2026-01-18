import MeetingList from "@/components/common/MeetingList";
import { useMeQuery } from "@/hooks/useMeQuery";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";

function PendingMeetingsList() {
  const { nickname } = useAuthStore();
  const { meetings, isLoading, isError, error } = useMeQuery(
    "joined",
    "pending",
    1,
    4,
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        모임을 불러오는 중 에러가 발생했습니다: {error?.message}
      </p>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="text-xl font-bold mb-4">{nickname} 님이 신청한 모임</div>
      {meetings && meetings.length > 0 ? (
        <MeetingList meetings={meetings} />
      ) : (
        <p className="text-center py-16 text-muted-foreground">
          신청한 모임이 없습니다.
        </p>
      )}
    </div>
  );
}

export default PendingMeetingsList;
