import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export const ProfileDropdown = () => {
  const { nickname, storeLogout } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const userAvatarUrl = "";

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar>
            <AvatarImage src={userAvatarUrl} alt="User Avatar" />
            <AvatarFallback>USER</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{nickname} 님</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-1">
          <AiOutlineUser />
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-1">
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
