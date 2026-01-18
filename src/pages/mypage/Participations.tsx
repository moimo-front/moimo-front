import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParticipantCard from "@/components/features/mypage/ParticipantCard";
import ParticipantSection from "@/components/features/mypage/ParticipantSection";
import { useParticipationQuery } from "@/hooks/useParticipationQuery";
import { useApproveAllParticipations } from "@/hooks/useParticipateMutations";

const Participations = () => {
    const { id } = useParams<{ id: string }>();
    const meetingId = Number(id);

    const [isWaitingOpen, setIsWaitingOpen] = useState(true);
    const [isConfirmedOpen, setIsConfirmedOpen] = useState(true);
    const [isRejectedOpen, setIsRejectedOpen] = useState(false);
    const { data: participants } = useParticipationQuery(meetingId);
    const { mutate: approveAll } = useApproveAllParticipations();

    const waitingParticipants = participants?.filter((participant) => participant.status === "PENDING") || [];
    const confirmedParticipants = participants?.filter((participant) => participant.status === "ACCEPTED") || [];
    const rejectedParticipants = participants?.filter((participant) => participant.status === "REJECTED") || [];

    return (
        <div className="w-full h-full p-10 bg-white overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">모이미 관리</h1>

            {/* 참여 대기 멤버 섹션 */}
            <ParticipantSection
                title="참여 대기 멤버"
                count={waitingParticipants.length}
                isOpen={isWaitingOpen}
                onToggle={() => setIsWaitingOpen(!isWaitingOpen)}
                actionButton={
                    <Button
                        className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-8 px-4 rounded-md text-xs border-none shadow-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            approveAll({ meetingId });
                        }}
                    >
                        모두승인
                    </Button>
                }
            >
                {waitingParticipants.map((participant) => (
                    <ParticipantCard key={participant.participationId} meetingId={meetingId} participant={participant} />
                ))}
            </ParticipantSection>

            {/* 참여 확정 멤버 섹션 */}
            <ParticipantSection
                title="참여 확정 멤버"
                count={confirmedParticipants.length}
                isOpen={isConfirmedOpen}
                onToggle={() => setIsConfirmedOpen(!isConfirmedOpen)}
            >
                {confirmedParticipants.map((participant) => (
                    <ParticipantCard key={participant.participationId} meetingId={meetingId} participant={participant} />
                ))}
            </ParticipantSection>

            {/* 거절된 멤버 섹션 */}
            <ParticipantSection
                title="거절된 멤버"
                count={rejectedParticipants.length}
                isOpen={isRejectedOpen}
                onToggle={() => setIsRejectedOpen(!isRejectedOpen)}
                contentClassName="opacity-60"
            >
                {rejectedParticipants.map((participant) => (
                    <ParticipantCard key={participant.participationId} meetingId={meetingId} participant={participant} />
                ))}
            </ParticipantSection>
        </div>
    );
};

export default Participations;