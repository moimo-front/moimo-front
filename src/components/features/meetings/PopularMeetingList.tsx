import { MEETING_CATEGORIES } from "@/constants/meetings";
import MeetingCard from "@features/meetings/MeetingCard";

function PopularMeetingList() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex justify-between w-full mb-4">
        <div className="text-xl font-bold">주간 인기 모임 List</div>
        <div className="text-sm cursor-pointer">전체보기</div>
      </div>
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {MEETING_CATEGORIES.slice(0, 8).map((meeting) => (
          <MeetingCard
            key={meeting.id}
            title={meeting.name}
            location={meeting.location}
            participantsCount={meeting.participantsCount}
            imageUrl={meeting.imageUrl}
            href={`/meetings/${meeting.id}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PopularMeetingList;
