import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";
import ChatMessageItem from "@/components/features/chattings/ChatMessage";
import ChatRoomItem from "@/components/features/chattings/ChatRoomItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { getChatRooms } from "@/api/chat.api"; // getMessages 제거됨
import { useChatSocket } from "@/hooks/useChatSocket";
import type { ChatRoom, ChatMessage } from "@/models/chat.model";

const Chatting = () => {
  const { nickname, userId } = useAuthStore();
  const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
  const [inputValue, setInputValue] = useState("");
  
  // [수정 1] 화면에 보여줄 메시지 목록 상태 관리
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 채팅방 목록 조회 (Left Panel)
  const { data: chatRooms } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: getChatRooms,
  });

  // [수정 2] 새 메시지 수신 핸들러 (useCallback으로 메모이제이션)
  const handleNewMessage = useCallback((newMessage: ChatMessage) => {
    // 현재 보고 있는 방의 메시지인지 확인 (혹은 훅에서 필터링 된 것을 가정하고 추가)
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  // [수정 3] 소켓 Hook 연결 (API 호출 없이 훅만 사용)
  const { initialMessages, sendMessage } = useChatSocket(
    selectedMeeting?.meetingId || null,
    handleNewMessage
  );

  // [수정 4] 방 이동 시 초기 메시지 로드 (훅에서 받아온 initialMessages 동기화)
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // 스크롤 제어 (메시지 추가될 때마다 하단으로)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
    // (옵션) 낙관적 업데이트가 필요하다면 여기서 messages에 미리 추가할 수도 있음
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-row h-screen bg-background pt-16">
      {/* [왼쪽 패널] 채팅방 목록 - 기존과 동일 */}
      <div className={`${selectedMeeting ? "hidden lg:flex" : "flex"} w-full lg:w-[30%] min-w-[300px] flex-col h-full border-r`}>
        <div className="p-4 font-semibold shrink-0">
          {nickname ? `${nickname} 님의 채팅` : "로그인이 필요합니다"}
        </div>
        <Separator />
        <div className="flex-grow overflow-y-auto">
          {chatRooms?.map((room) => (
            <div key={room.meetingId} onClick={() => setSelectedMeeting(room)}>
              <ChatRoomItem
                id={room.meetingId}
                meetingImage={room.image || ""}
                meetingTitle={room.title}
                lastMessageContent={room.lastMessage?.content || "대화를 시작하세요"}
                lastMessageTime={
                  room.lastMessage?.createdAt
                    ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ""
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* [오른쪽 패널] 채팅창 */}
      <div className={`${selectedMeeting ? "flex" : "hidden lg:flex"} w-full lg:w-[70%] flex-col h-full bg-card`}>
        {selectedMeeting ? (
          <>
            {/* 헤더 */}
            <div className="p-4 border-b shrink-0 flex items-center gap-3">
              <FaArrowLeft 
                className="cursor-pointer text-xl lg:hidden" 
                onClick={() => setSelectedMeeting(null)} 
              />
              <div>
                <h2 className="text-xl font-bold">{selectedMeeting.title}</h2>
                <p className="text-sm text-muted-foreground">
                  멤버 {selectedMeeting.memberCount}명
                </p>
              </div>
            </div>

            {/* 메시지 목록 (messages state 사용) */}
            <div 
              ref={scrollRef}
              className="flex flex-col gap-4 p-4 flex-grow overflow-y-auto"
            >
              {messages.map((msg, index) => (
                <ChatMessageItem
                  key={`${msg.id}-${index}`}
                  message={msg}
                  isMine={msg.senderId === userId}
                  hostId={selectedMeeting.hostId}
                />
              ))}
            </div>

            {/* 입력창 */}
            <div className="p-4 border-t shrink-0">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className="flex-grow"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button onClick={handleSendMessage}>
                  <IoIosSend />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>채팅방을 선택하여 대화를 시작하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatting;