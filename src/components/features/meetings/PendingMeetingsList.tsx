import { MEETING_CATEGORIES } from "@/constants/meetings";
import MeetingCard from "@features/meetings/MeetingCard";
import { useAuthStore } from "@/store/authStore";

function PendingMeetingsList() {
  const { username } = useAuthStore();
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex justify-between w-full mb-4">
        <div className="text-xl font-bold">
          {username} 님이 신청한 모임 List
        </div>
        <div className="text-sm cursor-pointer">전체보기</div>
      </div>
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {MEETING_CATEGORIES.slice(0, 4).map((topic) => (
          <MeetingCard
            key={topic.id}
            title={topic.name}
            location={topic.location}
            participantsCount={topic.participantsCount}
            imageUrl={topic.imageUrl}
            href=""
          />
        ))}
      </div>
    </div>
  );
}

export default PendingMeetingsList;
