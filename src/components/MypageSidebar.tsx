import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export const MypageSidebar = () => {
    // TODO: Replace with actual user data from context/store
    const user = {
        name: "노래하는 햄스터",
        isVerified: true,
        image: "https://github.com/shadcn.png" // Placeholder
    };

    return (
        <aside className="w-full h-full bg-white flex flex-col items-center py-10 border-r border-gray-100">
            {/* User Profile Section */}
            <div className="flex flex-col items-center mb-10 w-full px-4">
                <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-2 border-gray-100">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    {user.isVerified && (
                        <div className="bg-green-500 rounded p-[2px]">
                            <Check className="w-3 h-3 text-white" strokeWidth={4} />
                        </div>
                    )}
                </div>

                {user.isVerified && (
                    <p className="text-sm text-gray-400">인증 완료된 계정입니다.</p>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="w-full px-8 flex-1">
                <div className="flex flex-col gap-6">
                    <div>
                        <Link to="/mypage/profile" className="block text-lg font-bold text-gray-900 mb-2 hover:text-gray-700">
                            프로필
                        </Link>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">모임</h3>
                        <div className="flex flex-col gap-3 pl-2">
                            <Link to="/mypage/meetings/join" className="text-gray-500 hover:text-gray-900">
                                참여 모임
                            </Link>
                            <Link to="/mypage/meetings/hosting" className="text-gray-500 hover:text-gray-900">
                                내 모임
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Link to="/mypage/chat" className="block text-lg font-bold text-gray-900 hover:text-gray-700">
                            채팅
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="w-full px-8 mt-auto">
                <button className="text-gray-400 hover:text-gray-600 text-sm">
                    탈퇴하기
                </button>
            </div>
        </aside>
    );
};
