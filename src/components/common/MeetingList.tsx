import MeetingCard from "@features/meetings/MeetingCard";
import type { Meeting } from "@/models/meeting.model";

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList = ({ meetings }: MeetingListProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 justify-items-center">
      {meetings.filter(Boolean).map((meeting) => (
        <MeetingCard key={meeting.meetingId} meeting={meeting} />
      ))}
    </div>
  );
};

export default MeetingList;
