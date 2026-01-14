import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, MapPin, Users } from "lucide-react";
import { useState } from "react";

const HostMeeting = () => {
    // Mock Data for "내가 만든 모임"
    const myMeeting = {
        title: "내가 만든 모임",
        location: "우리집",
        currentUsers: 12,
        date: "1월 6일",
    };

    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="w-full h-full p-10 bg-white overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">내 모임</h1>

            {/* Summary Card */}
            <Card className="p-6 mb-12 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{myMeeting.title}</h2>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {myMeeting.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {myMeeting.currentUsers}명
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {myMeeting.date}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold border-none shadow-none">정보 관리</Button>
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold border-none shadow-none">채팅 관리</Button>
                </div>
            </Card>

            <div className="space-y-10 max-w-2xl">
                {/* Meeting Name */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">모임명</h3>
                    <Input placeholder="표현하고 싶은 모임명을 입력하세요!" className="border-gray-200" />
                </div>

                {/* Meeting Intro */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">모임 소개글</h3>
                    <div className="border border-gray-200 rounded-md p-4 bg-white">
                        <div className="text-sm text-gray-500 mb-2">
                            모임에 대해 자유롭게 설명해주세요! <br />
                            ex) 모임이 개설된 계기, 모임의 의미, 참여자가 가지면 좋은 마인드, 지켜야 할 사항
                        </div>
                        <Textarea className="border-none shadow-none p-0 resize-none focus-visible:ring-0 min-h-[80px]" />
                    </div>
                </div>

                {/* Meeting Photo */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">모임 사진</h3>
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold border-none shadow-none">이미지 찾기</Button>
                </div>

                {/* Meeting Schedule */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">모임 일정</h3>
                    <div className="border border-gray-200 rounded-md p-2 w-fit">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md"
                        />
                    </div>
                </div>

                {/* Meeting Location */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">모임 장소</h3>
                    <Input placeholder="초행길인 사람도 이해하기 쉽도록 장소를 가능한 상세하게 설명해주세요." className="border-gray-200" />
                </div>

                {/* Max Users */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">최대 인원수</h3>
                    <Input placeholder="수용할 수 있는 인원수 만큼만 받는게 중요해요!" type="number" className="border-gray-200" />
                </div>
            </div>
        </div>
    )
}

export default HostMeeting;