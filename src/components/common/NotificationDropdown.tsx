import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationDropdown = () => {
  const notificationAvatarUrl = "";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar>
            <AvatarImage
              src={notificationAvatarUrl}
              alt="Notification Avatar"
            />
            <AvatarFallback>알림</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>최근 알림</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-1">
          '크리스마스 솔로 모임' 승인이 완료되었습니다!
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-1">
          00명의 모이미들이 내 모임에 신청했습니다! 확인하러 가볼까요?
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-1">
          임시 알림 메시지입니다. 2팀 화이팅!
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
