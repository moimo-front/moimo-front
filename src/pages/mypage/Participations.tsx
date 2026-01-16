import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Participant } from "@/models/participation.model";
import ParticipantCard from "@/components/features/mypage/ParticipantCard";
import { useParticipationQuery } from "@/hooks/useParticipationQuery";

const Participations = () => {
    const { id } = useParams<{ id: string }>();
    const meetingId = Number(id);

    const [isWaitingOpen, setIsWaitingOpen] = useState(true);
    const [isConfirmedOpen, setIsConfirmedOpen] = useState(true);
    const { data: participants } = useParticipationQuery(meetingId);

    const waitingParticipants = participants?.filter((participant) => participant.status === "PENDING") || [];
    const confirmedParticipants = participants?.filter((participant) => participant.status === "ACCEPTED") || [];


    return (
        <div className="w-full h-full p-10 bg-white overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">모이미 관리</h1>

            {/* 참여 대기 멤버 섹션 */}
            <div className="mb-12">
                <div
                    className="flex justify-between items-center pb-4 border-b border-gray-200 cursor-pointer mb-6"
                    onClick={() => setIsWaitingOpen(!isWaitingOpen)}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">참여 대기 멤버</span>
                        <span className="text-[#6B66FF] font-bold">{String(waitingParticipants.length).padStart(2, '0')}명</span>
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
                        {waitingParticipants.map((participant) => (
                            <ParticipantCard key={participant.participationId} participant={participant} />
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
                        <span className="text-[#6B66FF] font-bold">{String(confirmedParticipants.length).padStart(2, '0')}명</span>
                    </div>
                    {isConfirmedOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>

                {isConfirmedOpen && (
                    <div className="space-y-4">
                        {confirmedParticipants.map((participant) => (
                            <ParticipantCard key={participant.participationId} participant={participant} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Participations;