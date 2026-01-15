import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineTeam } from "react-icons/ai";
import { Link } from "react-router-dom";
import type { Meeting } from "@/models/meeting.model";
import { getDistrictFromAddress } from "@/lib/formatAddress";

interface MeetingCardProps {
  meeting: Meeting;
  imageUrl?: string;
  className?: string;
}

function MeetingCard({ meeting, imageUrl, className }: MeetingCardProps) {
  const { meetingId, title, address, currentParticipants } = meeting;
  const href = `/meetings/${meetingId}`;
  return (
    <Link
      to={href}
      className="block w-48 h-60 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow",
          className
        )}
      >
        {/* 상단: 모임 사진*/}
        <div className="relative w-full h-[60%]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">
                {title}
              </span>
            </div>
          )}
        </div>

        {/* 중간: 모임 제목 */}
        <CardHeader className="p-3 flex-grow">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-1">
            {title}
          </CardTitle>
        </CardHeader>

        {/* 하단: 위치 및 참여자 수 */}
        <CardFooter className="p-3 pt-0 flex gap-4 items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <IoLocationOutline />
            <span>{getDistrictFromAddress(address)}</span>
          </div>
          <div className="flex items-center">
            <AiOutlineTeam />
            <span>{currentParticipants} 명</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default MeetingCard;
