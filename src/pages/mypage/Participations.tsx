import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Member {
    id: number;
    nickname: string;
    profileImage: string;
}

const Participations = () => {
    const [isWaitingOpen, setIsWaitingOpen] = useState(true);
    const [isConfirmedOpen, setIsConfirmedOpen] = useState(true);

    // Mock data
    const waitingMembers: Member[] = [
        { id: 1, nickname: "닉네임1", profileImage: "" },
        { id: 2, nickname: "닉네임3", profileImage: "" },
    ];

    const confirmedMembers: Member[] = [
        { id: 4, nickname: "닉네임2", profileImage: "" },
        { id: 5, nickname: "닉네임4", profileImage: "" },
    ];

    return (
        <div className="w-full h-full p-10 bg-white overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">멤버 관리</h1>

            {/* 참여 대기 멤버 섹션 */}
            <div className="mb-12">
                <div
                    className="flex justify-between items-center pb-4 border-b border-gray-200 cursor-pointer mb-6"
                    onClick={() => setIsWaitingOpen(!isWaitingOpen)}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">참여 대기 멤버</span>
                        <span className="text-[#6B66FF] font-bold">{String(waitingMembers.length).padStart(2, '0')}명</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-8 px-4 rounded-md text-xs border-none shadow-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("모두 승인");
                            }}
                        >
                            모두승인
                        </Button>
                        {isWaitingOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                </div>

                {isWaitingOpen && (
                    <div className="space-y-4">
                        {waitingMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex justify-between items-center p-4 border border-[#FFB800] rounded-xl bg-white shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 bg-gray-200">
                                        <AvatarImage src={member.profileImage} />
                                        <AvatarFallback>{member.nickname[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-lg font-medium text-gray-700">{member.nickname}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="bg-[#FF8A8A] hover:bg-[#FF7070] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                                        onClick={() => console.log("거절", member.id)}
                                    >
                                        거절
                                    </Button>
                                    <Button
                                        className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                                        onClick={() => console.log("승인", member.id)}
                                    >
                                        승인
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 참여 확정 멤버 섹션 */}
            <div>
                <div
                    className="flex justify-between items-center pb-4 border-b border-gray-200 cursor-pointer mb-6"
                    onClick={() => setIsConfirmedOpen(!isConfirmedOpen)}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">참여 확정 멤버</span>
                        <span className="text-[#6B66FF] font-bold">{String(confirmedMembers.length).padStart(2, '0')}명</span>
                    </div>
                    {isConfirmedOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>

                {isConfirmedOpen && (
                    <div className="space-y-4">
                        {confirmedMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex justify-between items-center p-4 border border-[#FFB800] rounded-xl bg-white shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 bg-gray-200">
                                        <AvatarImage src={member.profileImage} />
                                        <AvatarFallback>{member.nickname[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-lg font-medium text-gray-700">{member.nickname}</span>
                                </div>
                                <Button
                                    className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                                    onClick={() => console.log("승인취소", member.id)}
                                >
                                    승인취소
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Participations;