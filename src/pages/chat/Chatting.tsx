import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";
import ChatMessageItem from "@/components/features/chattings/ChatMessage";
import ChatRoomItem from "@/components/features/chattings/ChatRoomItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { getChatRooms, getMessages } from "@/api/chat.api";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { ChatMessage, ChatRoom } from "@/models/chat.model";

const Chatting = () => {
  const { nickname, userId } = useAuthStore();
  const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [localChatRooms, setLocalChatRooms] = useState<ChatRoom[]>([]);

  // 스크롤 제어를 위한 Ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 채팅방 목록 조회 (Left Panel)
  const { data: chatRooms, isSuccess } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: getChatRooms,
  });

  useEffect(() => {
    if (chatRooms) {
      setLocalChatRooms(chatRooms);
    }
  }, [chatRooms]);

  // 2. 소켓 Hook 연결 (Right Panel)
  const { messages, setMessages, sendMessage } = useChatSocket(
    selectedMeeting?.meetingId || null
  );

  // 3. 과거 메시지 내역 조회 (API)
  const { data: historyData } = useQuery({
    queryKey: ["chatMessages", selectedMeeting?.meetingId],
    queryFn: () => getMessages(selectedMeeting!.meetingId),
    enabled: !!selectedMeeting,
  });

  useEffect(() => {
    if (historyData?.messages) {
      setMessages(historyData.messages);
    }
  }, [historyData, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSendMessage();
    }
  };

  // --- 임시 테스트 함수 ---
  const addTestRoom = () => {
    const testRoom: ChatRoom = {
      meetingId: 999,
      title: "🚀 테스트용 채팅방",
      image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Test",
      memberCount: 2,
      isLeader: true,
      hostId: 12345,
      lastMessage: {
        sender: "System",
        content: "이것은 테스트용 채팅방입니다.",
        createdAt: new Date().toISOString(),
      },
    };
    setLocalChatRooms((prev) => [...prev, testRoom]);
  };

  const receiveTestMessage = () => {
    const testMessage: ChatMessage = {
      id: Date.now(),
      senderId: 12345,
      content: `[테스트] 이것은 상대방으로부터 받은 테스트 메시지입니다. (${new Date().toLocaleTimeString()})`,
      createdAt: new Date().toISOString(),
      meetingId: selectedMeeting!.meetingId,
      sender: { id: 12345, nickname: "테스트봇", profile_image: "" },
    };
    setMessages((prev) => [...prev, testMessage]);
  };

  const testSendMessage = () => {
    console.log("SENDING TEST MESSAGE: 'Hello, world!'");
    sendMessage("Hello, world!");
  };

  return (
    <div className="flex flex-row h-screen bg-background pt-16">
      <div
        className={`${
          selectedMeeting ? "hidden lg:flex" : "flex"
        } w-full lg:w-[30%] min-w-[300px] flex-col h-full border-r`}
      >
        <div className="p-4 font-semibold shrink-0">
          {nickname ? `${nickname} 님의 채팅` : "로그인이 필요합니다"}
        </div>
        <Separator />
        <div className="flex-grow overflow-y-auto">
          {localChatRooms?.map((room) => (
            <div key={room.meetingId} onClick={() => setSelectedMeeting(room)}>
              <ChatRoomItem
                id={room.meetingId}
                meetingImage={room.image || ""}
                meetingTitle={room.title}
                lastMessageContent={
                  room.lastMessage?.content || "대화를 시작하세요"
                }
                lastMessageTime={
                  room.lastMessage?.createdAt
                    ? new Date(room.lastMessage.createdAt).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )
                    : ""
                }
              />
            </div>
          ))}
          {isSuccess && localChatRooms?.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <p>참여 중인 모임이 없습니다.</p>
              {/* 개발 모드에서만 임시 버튼 보이기 */}
              {import.meta.env.DEV && (
                <Button onClick={addTestRoom} className="mt-4">
                  임시 채팅방 추가
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={`${
          selectedMeeting ? "flex" : "hidden lg:flex"
        } w-full lg:w-[70%] flex-col h-full bg-card`}
      >
        {selectedMeeting ? (
          <>
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
              {/* 개발 모드에서만 임시 버튼 보이기 */}
              {import.meta.env.DEV && (
                <div className="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={receiveTestMessage}
                  >
                    가짜 메시지 받기
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={testSendMessage}
                  >
                    전송 테스트
                  </Button>
                </div>
              )}
            </div>
            <div
              ref={scrollRef}
              className="flex flex-col gap-4 p-4 flex-grow overflow-y-auto"
            >
              {messages.map((msg, index) => (
                <ChatMessageItem
                  key={`${msg.id}-${index}`}
                  message={msg}
                  isMine={msg.senderId === userId}
                  hostId={selectedMeeting!.hostId}
                />
              ))}
            </div>
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
