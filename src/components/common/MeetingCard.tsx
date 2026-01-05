import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface MeetingCardProps {
  title: string;
  imageUrl?: string;
  location: string;
  participantsCount: number;
  onClick?: () => void;
  className?: string;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  title,
  imageUrl,
  location,
  participantsCount,
  onClick,
  className,
}) => {
  return (
    <Card
      className={cn(
        "flex flex-col w-48 h-60 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow",
        className
      )}
      onClick={onClick}
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
          {/* 위치 아이콘 (추후 추가 가능) */}
          <span>{location}</span>
        </div>
        <div className="flex items-center">
          {/* 참여자 아이콘 (추후 추가 가능) */}
          <span>{participantsCount} 명</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
