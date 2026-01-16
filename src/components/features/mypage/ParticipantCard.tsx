import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Participant } from "@/models/participation.model";

interface ParticipantCardProps {
    participant: Participant;
}

const ParticipantCard = ({ participant }: ParticipantCardProps) => {
    return (
        <div
            className="flex justify-between items-center p-4 border border-[#FFB800] rounded-xl bg-white shadow-sm"
        >
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-gray-200">
                    <AvatarImage src={participant.profileImage} />
                    <AvatarFallback>{participant.nickname[0]}</AvatarFallback>
                </Avatar>
                <span className="text-lg font-medium text-gray-700">{participant.nickname}</span>
            </div>
            <div className="flex gap-2">
                {participant.status === "PENDING" ? (
                    <>
                        <Button
                            className="bg-[#FF8A8A] hover:bg-[#FF7070] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                            onClick={() => console.log("거절", participant.participationId)}
                        >
                            거절
                        </Button>
                        <Button
                            className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                            onClick={() => console.log("승인", participant.participationId)}
                        >
                            승인
                        </Button>
                    </>
                ) : (
                    <Button
                        className="bg-[#FFB800] hover:bg-[#E5A600] text-white font-bold h-9 px-6 rounded-lg border-none shadow-none text-base"
                        onClick={() => console.log("승인취소", participant.participationId)}
                    >
                        승인취소
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ParticipantCard;