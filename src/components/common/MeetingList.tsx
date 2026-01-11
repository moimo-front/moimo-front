import MeetingCard from "@/components/common/MeetingCard";
import type { Meeting } from "@/models/meeting.model";

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList = ({ meetings }: MeetingListProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {meetings.filter(Boolean).map((meeting) => (
          <MeetingCard key={meeting.meetingId} meeting={meeting} />
        ))}
      </div>
    </div>
  );
};

export default MeetingList;
