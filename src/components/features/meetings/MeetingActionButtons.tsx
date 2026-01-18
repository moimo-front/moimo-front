import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FixedBottomButton from "@/components/common/FixedBottomButton";

interface MeetingActionButtonsProps {
  meetingId: number;
  role: "host" | "participant";
  location?: "detail-mid" | "detail-bottom" | "detail-top" | "hosting-list";

  // 호스트 전용
  onEdit?: () => void;
  onDelete?: () => void;

  // 참가자 전용
  isPending?: boolean;
  isLoggedIn?: boolean;
  onJoin?: () => void;
}

function MeetingActionButtons({
  meetingId,
  role,
  location = "hosting-list",
  onEdit,
  onDelete,
  isPending = false,
  isLoggedIn = false,
  onJoin,
}: MeetingActionButtonsProps) {
  const navigate = useNavigate();

  const handleManageClick = () => {
    navigate(`/mypage/meetings/hosting/${meetingId}/participations`);
  };

  const handleChatClick = () => {
    navigate("/chats", { state: { meetingId } });
  };

  // Host
  if (role === "host") {
    // 상단 인라인 버튼 (승인 요청 목록 + 채팅)
    if (location === "detail-mid") {
      return (
        <div className="flex gap-2">
          <Button
            onClick={handleManageClick}
            className="flex-[3] py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm font-medium"
          >
            승인 요청 목록 보기
          </Button>
          <Button
            onClick={handleChatClick}
            variant="outline"
            className="flex-[2] py-2.5 rounded-md transition-colors text-sm font-medium"
          >
            채팅
          </Button>
        </div>
      );
    }

    // 하단 고정 버튼 (승인 요청 목록만)
    if (location === "detail-bottom") {
      return (
        <FixedBottomButton onClick={handleManageClick}>
          승인 요청 목록 보기
        </FixedBottomButton>
      );
    }

    // 헤더 버튼 (수정 + 삭제)
    if (location === "detail-top") {
      return (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2 border-yellow-400"
            >
              <Pencil className="h-4 w-4 text-yellow-500" />
              수정
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="gap-2 border-red-500 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          )}
        </div>
      );
    }

    // 카드 내부: 관리 + 수정 + 삭제 + 채팅
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleManageClick}
          className="border-yellow-400 text-gray-900 shadow-none"
        >
          모이미 관리
        </Button>

        {onEdit && (
          <Button
            variant="outline"
            onClick={onEdit}
            className="border-yellow-400 text-gray-900 shadow-none"
          >
            <Pencil className="w-4 h-4 text-yellow-500" />
            수정
          </Button>
        )}

        {onDelete && (
          <Button
            variant="outline"
            onClick={onDelete}
            className="border-red-500 text-red-600 hover:bg-red-50 shadow-none"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </Button>
        )}

        <Button
          onClick={handleChatClick}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold border-none shadow-none"
        >
          채팅
        </Button>
      </div>
    );
  }

  // Participant
  if (role === "participant") {
    const buttonText = isPending
      ? "승인 요청 중"
      : isLoggedIn
        ? "이 모임 신청하기"
        : "로그인하고 신청하기";

    // 상단 인라인 신청하기 버튼
    if (location === "detail-mid") {
      return (
        <Button
          onClick={onJoin}
          disabled={isPending}
          className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm font-medium disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {buttonText}
        </Button>
      );
    }

    // 하단 고정 버튼
    if (location === "detail-bottom") {
      return (
        <FixedBottomButton onClick={onJoin} disabled={isPending}>
          {buttonText}
        </FixedBottomButton>
      );
    }
  }

  return null;
}

export default MeetingActionButtons;
