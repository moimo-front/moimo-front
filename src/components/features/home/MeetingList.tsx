import MeetingCard from "@features/meetings/MeetingCard";
import type { Meeting } from "@/models/meeting.model";

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList = ({ meetings }: MeetingListProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
      {meetings.filter(Boolean).map((meeting) => (
        <MeetingCard key={meeting.meetingId} meeting={meeting} imageUrl={meeting.meetingImage} />
      ))}
    </div>
  );
};

export default MeetingList;
