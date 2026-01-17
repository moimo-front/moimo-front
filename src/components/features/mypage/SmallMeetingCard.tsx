import type { MyMeetingsResponse } from "@/api/me.api";
import { Card } from "@/components/ui/card";
import { getDistrictFromAddress } from "@/lib/formatAddress";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface SmallMeetingCardProps {
    meeting: MyMeetingsResponse;
    children?: React.ReactNode;
    className?: string;
}

const SmallMeetingCard = ({ meeting, children, className }: SmallMeetingCardProps) => {
    return (
        <Card
            key={meeting.meetingId}
            className={`flex items-center p-6 transition-shadow border-none shadow-none ${className} ${(meeting.status === 'PENDING' || meeting.isCompleted)
                ? 'bg-gray-100'
                : 'bg-white border border-gray-100 shadow-sm'
                }`}
        >
            <div className="flex-1">
                <Link to={`/meetings/${meeting.meetingId}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{meeting.title}</h3>
                </Link>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {getDistrictFromAddress(meeting.address)}
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {meeting.currentParticipants}/{meeting.maxParticipants}명
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(meeting.meetingDate, "PPP", { locale: ko })}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                {children}
            </div>
        </Card>
    )
}

export default SmallMeetingCard;