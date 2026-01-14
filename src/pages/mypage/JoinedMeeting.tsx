import { Button } from "@/components/ui/button";
import {
    Card,
} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock Data
const meetings = [
    {
        id: 1,
        title: "같이 축구보고 게임해요!",
        location: "이태원",
        currentUsers: 12,
        date: "1월 15일",
        status: "APPROVED", // APPROVED, PENDING, COMPLETED
        isHost: false,
    },
    {
        id: 2,
        title: "보라매공원 경찰과 도둑 할 사람",
        location: "보라매공원",
        currentUsers: 12,
        date: "1월 7일",
        status: "PENDING",
        isHost: false,
    },
    {
        id: 3,
        title: "내가 만든 모임",
        location: "우리집",
        currentUsers: 12,
        date: "1월 6일",
        status: "APPROVED",
        isHost: true,
    },
    {
        id: 4,
        title: "[참여완료] 크리스마스 기념 정모",
        location: "이태원",
        currentUsers: 12,
        date: "12월 25일",
        status: "COMPLETED",
        isHost: false,
    },
    {
        id: 5,
        title: "[참여완료] 크리스마스 기념 정모",
        location: "이태원",
        currentUsers: 12,
        date: "1월 15일",
        status: "COMPLETED",
        isHost: false,
    }
];

const JoinedMeeting = () => {
    const [filter, setFilter] = useState("all");

    return (
        <div className="w-full h-full p-10 bg-white overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
                <h1 className="text-2xl font-bold text-gray-900">참여 모임</h1>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="pending">승인대기</SelectItem>
                        <SelectItem value="approved">참석예정</SelectItem>
                        <SelectItem value="completed">참석완료</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4 mb-10">
                {meetings.map((meeting) => (
                    <Card
                        key={meeting.id}
                        className={`flex items-center p-6 transition-shadow border-none shadow-none ${(meeting.status === 'PENDING' || meeting.status === 'COMPLETED')
                            ? 'bg-gray-100'
                            : 'bg-white border border-gray-100 shadow-sm'
                            }`}
                    >
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{meeting.title}</h3>
                            <div className="flex items-center gap-4 text-gray-500 text-sm">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {meeting.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {meeting.currentUsers}명
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {meeting.date}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {meeting.isHost ? (
                                <>
                                    <Button className="bg-orange-100 text-orange-400 hover:bg-orange-200 border-none shadow-none">관리</Button>
                                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-white border-none shadow-none">채팅</Button>
                                </>
                            ) : (
                                <>
                                    {meeting.status === 'PENDING' && (
                                        <Button disabled className="bg-orange-200 text-white hover:bg-orange-200 border-none shadow-none disabled:opacity-100 disabled:bg-orange-200">승인 대기중</Button>
                                    )}
                                    {meeting.status === 'APPROVED' && (
                                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-white border-none shadow-none">채팅</Button>
                                    )}
                                    {meeting.status === 'COMPLETED' && (
                                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-white border-none shadow-none">채팅</Button>
                                    )}
                                </>
                            )}

                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State (Hidden if meetings exist, but coded for reference) */}
            {meetings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">아직 참여한 모임이 없어요 :&lt;</h3>
                    <Link to="/meetings" className="text-gray-900 font-bold flex items-center hover:underline">
                        첫번째 모임을 찾아볼까요? &gt;
                    </Link>
                </div>
            )}


            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default JoinedMeeting;