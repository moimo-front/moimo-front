import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";
import ChatMessage from "@/components/features/chattings/ChatMessage";
import ChatRoomItem from "@/components/features/chattings/ChatRoomItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

const Chatting = () => {
  const { nickname } = useAuthStore();
  return (
    <div className="flex flex-row h-screen bg-background">
      {/* 왼쪽 패널 */}
      <div className="w-[30%] min-w-[300px] flex flex-col h-full border-r">
        <div className="p-4 font-semibold shrink-0">
          {nickname ? nickname : "노래하는햄스터"} 님
        </div>
        <Separator />
        <div className="p-4 font-bold text-lg shrink-0">채팅방 목록</div>
        <div className="flex-grow overflow-y-auto">
          {/* TODO: UI 확인을 위한 하드코딩, 추후 수정 필요 */}
          <ChatRoomItem
            id="1"
            meetingImage="https://picsum.photos/id/10/200/200"
            meetingTitle="주말 하이킹 모임"
            lastMessageContent="이번 주말 날씨가 좋아서 기대되네요!"
            lastMessageTime="오전 10:30"
          />
          <ChatRoomItem
            id="2"
            meetingImage="https://picsum.photos/id/20/200/200"
            meetingTitle="코딩 스터디 그룹"
            lastMessageContent="다음 프로젝트 아이디어 있으신 분?"
            lastMessageTime="어제 18:00"
          />
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="w-[70%] flex flex-col h-full">
        {/* 헤더 */}
        <div className="p-4 border-b shrink-0 flex items-center gap-3">
          <FaArrowLeft className="cursor-pointer text-xl text-muted-foreground" />
          <div>
            <h2 className="text-xl font-bold">주말 하이킹 모임</h2>
            <p className="text-sm text-muted-foreground">멤버 3명</p>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex flex-col gap-4 p-4 flex-grow overflow-y-auto bg-card">
          <ChatMessage
            message={{
              id: 1,
              senderId: 101,
              meetingId: 201,
              content: "안녕하세요! 모임 관련해서 궁금한 게 있습니다.",
              createdAt: "오전 10:00",
              sender: {
                id: 101,
                email: "opponent1@example.com",
                nickname: "상대방1",
                image: "https://github.com/shadcn.png",
              },
            }}
            isMine={false}
          />
          <ChatMessage
            message={{
              id: 2,
              senderId: 102,
              meetingId: 201,
              content: "이번 주말에 모임 장소 어디로 하시나요?",
              createdAt: "오전 10:05",
              sender: {
                id: 102,
                email: "opponent2@example.com",
                nickname: "상대방2",
                image: "https://github.com/shadcn.png",
              },
            }}
            isMine={false}
          />
          <ChatMessage
            message={{
              id: 3,
              senderId: 103, // Assuming this is 'me'
              meetingId: 201,
              content: "궁금한 점 말씀해주세요! 장소는 따로 공지하겠습니다.",
              createdAt: "오전 10:10",
              sender: {
                id: 103,
                email: "me@example.com",
                nickname: "나",
                image: "https://github.com/shadcn.png",
              },
            }}
            isMine={true}
          />
        </div>

        {/* 입력창 */}
        <div className="p-4 border-t shrink-0">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="메시지를 입력하세요..."
              className="flex-grow bg-card"
            />
            <Button>
              <IoIosSend />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
