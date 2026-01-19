import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Participant } from "@/models/participation.model";
import {
    useApproveParticipation,
    useRejectParticipation,
    useCancelParticipation
} from "@/hooks/useParticipateMutations";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import defaultProfile from "@/assets/images/profile.png";

interface ParticipantCardProps {
    meetingId: number;
    participant: Participant;
}

const ParticipantCard = ({ meetingId, participant }: ParticipantCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: approve } = useApproveParticipation();
    const { mutate: reject } = useRejectParticipation();
    const { mutate: cancel } = useCancelParticipation();

    const handleApprove = () => approve({ meetingId, participationId: participant.participationId });
    const handleReject = () => reject({ meetingId, participationId: participant.participationId });
    const handleCancel = () => cancel({ meetingId, participationId: participant.participationId });
    const handleReset = () => {
        // 거절 취소 시에는 명세에 명확한 액션이 없으나, 
        // 맥락상 cancel(PENDING으로 되돌림)을 사용하거나 별도 구현이 필요할 수 있음.
        // 여기서는 명세의 cancel 로직이 ACCEPTED -> PENDING임을 고려하여 cancel 사용.
        cancel({ meetingId, participationId: participant.participationId });
    };

    return (
        <div
            className="flex justify-between items-center p-4 border border-[#FFB800] rounded-xl bg-white shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <Avatar
                        className="w-10 h-10 bg-gray-200"
                    >
                        <AvatarImage
                            src={participant.profileImage || defaultProfile}
                            alt={participant.nickname || "user"}
                            className="object-cover"
                        />
                        <AvatarFallback>{participant.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-lg font-medium text-gray-700">{participant.nickname}</span>
                </div>
            </div>
            <div className="flex gap-2">
                {participant.status === "PENDING" && (
                    <>
                        <Button
                            className="bg-[#FF8A8A] hover:bg-[#FF7070] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                            onClick={handleReject}
                        >
                            거절
                        </Button>
                        <Button
                            className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                            onClick={handleApprove}
                        >
                            승인
                        </Button>
                    </>
                )}
                {participant.status === "ACCEPTED" && (
                    <Button
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                        onClick={handleCancel}
                    >
                        승인취소
                    </Button>
                )}
                {participant.status === "REJECTED" && (
                    <Button
                        className="bg-blue-400 hover:bg-blue-500 text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                        onClick={handleReset}
                    >
                        거절취소
                    </Button>
                )}
            </div>

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userInfo={participant}
                userId={participant.userId}
                readOnly={true}
            />
        </div>
    );
};

export default ParticipantCard;
