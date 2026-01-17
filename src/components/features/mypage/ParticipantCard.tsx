import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Participant, ParticipationStatus } from "@/models/participation.model";
import { useUpdateParticipation } from "@/hooks/useParticipateMutations";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

interface ParticipantCardProps {
    meetingId: number;
    participant: Participant;
}

const ParticipantCard = ({ meetingId, participant }: ParticipantCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: updateParticipation } = useUpdateParticipation();

    const handleUpdateStatus = (status: ParticipationStatus) => {
        updateParticipation({
            meetingId,
            updates: [{ participationId: participant.participationId, status }]
        });
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
                        <AvatarImage src={participant.profileImage || undefined} />
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
                            onClick={() => handleUpdateStatus("REJECTED")}
                        >
                            거절
                        </Button>
                        <Button
                            className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                            onClick={() => handleUpdateStatus("ACCEPTED")}
                        >
                            승인
                        </Button>
                    </>
                )}
                {participant.status === "ACCEPTED" && (
                    <Button
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                        onClick={() => handleUpdateStatus("PENDING")}
                    >
                        승인취소
                    </Button>
                )}
                {participant.status === "REJECTED" && (
                    <Button
                        className="bg-blue-400 hover:bg-blue-500 text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                        onClick={() => handleUpdateStatus("PENDING")}
                    >
                        거절취소
                    </Button>
                )}
            </div>

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userInfo={participant}
            />
        </div>
    );
};

export default ParticipantCard;
