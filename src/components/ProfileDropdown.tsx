import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultProfileImage from "@/assets/images/profile.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineUser, AiOutlineTeam } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/hooks/useAuthMutations";
import { useQueryClient } from "@tanstack/react-query";
import type { VerifyUserResponse } from "@/api/auth.api";

export const ProfileDropdown = () => {
  const { nickname } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  const userData = queryClient.getQueryData<VerifyUserResponse>(["authUser"]);
  const userProfileImage = userData?.profileImage || defaultProfileImage;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar>
            <AvatarImage src={userProfileImage} alt="User Avatar" />
            <AvatarFallback>USER</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{nickname} 님</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => navigate("/mypage")}
        >
          <AiOutlineUser />
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => navigate("/mypage/meetings/hosting")}
        >
          <AiOutlineTeam />내 모임
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-1" onClick={handleLogout}>
          <LuLogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
