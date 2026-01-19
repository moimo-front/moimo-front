import { useState, useMemo } from "react";
import { useParticipationQuery } from "@/hooks/useParticipationQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Crown, User } from "lucide-react";
import ProfileModal from "../mypage/ProfileModal";
import type { MeetingDetail } from "@/models/meeting.model";
import defaultProfile from "@/assets/images/profile.png";

// 화면에 표시할 참여자 정보 (API 응답 기반)
type DisplayParticipant = {
  userId: number;
  nickname: string;
  profileImage: string | null;
  bio: string | null;
  isHost: boolean;
};

interface ParticipantsCardProps {
  meetingId: number;
  host: MeetingDetail["host"];
  currentParticipants: number;
  maxParticipants: number;
}

export function ParticipantsCard({ meetingId, host, currentParticipants, maxParticipants }: ParticipantsCardProps) {
  const { data: participants = [] } = useParticipationQuery(meetingId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // 참여자 목록 정렬 및 가공
  const sortedParticipants = useMemo(() => {
    // 1. 호스트와 게스트 구분
    const hostParticipant = participants.find(p => p.userId === host.hostId);

    // 게스트 목록 (호스트 제외, ACCEPTED 상태만)
    const guests = participants.filter(p => {
      const isHost = (host.hostId && p.userId === host.hostId) || p.nickname === host.nickname;
      const isAccepted = p.status === "ACCEPTED"; // 대소문자 주의? 일단 대문자
      return !isHost && isAccepted;
    });

    const list: DisplayParticipant[] = [];

    // 2. 호스트 추가 (무조건 존재한다고 가정)
    if (hostParticipant) {
      list.push({
        userId: hostParticipant.userId,
        nickname: hostParticipant.nickname,
        profileImage: hostParticipant.profileImage,
        bio: hostParticipant.bio,
        isHost: true
      });
    } else {
      // 만약 API 응답 지연 등으로 리스트에 없을 경우 MeetingDetail 정보 사용 (최소한의 표시)
      list.push({
        userId: host.hostId,
        nickname: host.nickname,
        profileImage: host.hostImage,
        bio: host.bio,
        isHost: true
      });
    }

    // 3. 게스트 추가
    guests.forEach(guest => {
      list.push({
        userId: guest.userId,
        nickname: guest.nickname,
        profileImage: guest.profileImage,
        bio: guest.bio,
        isHost: false
      });
    });

    return list;
  }, [participants, host]);

  // 보여줄 목록 계산
  const visibleParticipants = isExpanded ? sortedParticipants : sortedParticipants.slice(0, 5); // 기본 5명

  const handleUserClick = (userId: number) => {
    if (userId > 0) {
      setSelectedUserId(userId);
    }
  };

  return (
    <>
      <Card className="w-full border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              참여자 <span className="text-primary">{currentParticipants}/{maxParticipants}</span>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[400px] overflow-y-auto" : "max-h-auto"}`}>
            {/* 목록 */}
            <div className="divide-y divide-border/30">
              {visibleParticipants.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => handleUserClick(user.userId)}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12 border border-border bg-muted flex items-center justify-center">
                      <AvatarImage src={user.profileImage || defaultProfile} className="object-cover" />
                      <AvatarFallback className="bg-transparent">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    {/* 호스트 뱃지 (프로필 사진 위에 작게) */}
                    {user.isHost && (
                      <div className="absolute -top-1.5 -right-1.5 bg-primary text-white p-1 rounded-full shadow-sm border border-white">
                        <Crown className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`font-bold truncate ${user.isHost ? "text-lg" : "text-base"}`}>
                        {user.nickname}
                      </span>
                      {/* 텍스트 뱃지 */}
                      {user.isHost ? (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] px-1.5 py-0 h-5">
                          모이머
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0 h-5 border-border">
                          모이미
                        </Badge>
                      )}
                    </div>

                    {/* Host의 bio만 표시 */}
                    {user.isHost && (
                      <p className="text-sm text-muted-foreground truncate">
                        {user.bio || "모임장입니다."}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 더보기 버튼 */}
          {sortedParticipants.length > 5 && (
            <Button
              variant="ghost"
              className="w-full rounded-none h-12 border-t border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <span className="flex items-center gap-2">접기 <ChevronUp className="w-4 h-4" /></span>
              ) : (
                <span className="flex items-center gap-2">더보기 (+{sortedParticipants.length - 5}명) <ChevronDown className="w-4 h-4" /></span>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 프로필 모달 */}
      {selectedUserId && (
        <ProfileModal
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          userId={selectedUserId}
          readOnly={true}
        />
      )}
    </>
  );
}
