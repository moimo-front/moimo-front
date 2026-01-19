import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";
import ChatMessageItem from "@/components/features/chattings/ChatMessage";
import ChatRoomItem from "@/components/features/chattings/ChatRoomItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { getChatRooms } from "@/api/chat.api";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { ChatRoom, ChatMessage } from "@/models/chat.model";
import { useLocation } from "react-router-dom";

const Chatting = () => {
  const { nickname, userId } = useAuthStore();
  const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const location = useLocation();

  // 1. 채팅방 목록 조회 (Left Panel)
  const { data: chatRooms, isLoading } = useQuery({
    queryKey: ["chatRooms", userId],
    queryFn: getChatRooms,
    enabled: !!userId,
  });

  const handleNewMessage = useCallback(
    (newMessage: ChatMessage) => {
      // 1. 현재 보고 있는 채팅방에 새 메시지 추가
      if (newMessage.meetingId === selectedMeeting?.meetingId) {
        setMessages((prev) => [...prev, newMessage]);
      }

      // 2. 'chatRooms' 쿼리 데이터(왼쪽 채팅방 목록)를 직접 업데이트
      queryClient.setQueryData<ChatRoom[]>(["chatRooms", userId], (oldData) => {
        if (!oldData) return [];

        // 최신 메시지를 받은 채팅방을 찾아 lastMessage 정보 업데이트
        const updatedData = oldData.map((room) => {
          if (room.meetingId === newMessage.meetingId) {
            return {
              ...room,
              lastMessage: {
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                sender: newMessage.sender.nickname,
              },
            };
          }
          return room;
        });

        // 해당 채팅방을 목록의 맨 위로 이동
        const targetRoomIndex = updatedData.findIndex(
          (room) => room.meetingId === newMessage.meetingId,
        );
        if (targetRoomIndex > 0) {
          const targetRoom = updatedData.splice(targetRoomIndex, 1)[0];
          updatedData.unshift(targetRoom);
        }

        return updatedData;
      });
    },
    [queryClient, selectedMeeting?.meetingId, userId],
  );

  const { initialMessages, sendMessage } = useChatSocket(
    selectedMeeting?.meetingId || null,
    handleNewMessage,
  );

  // 방을 바꿀 때마다 useChatSocket 으로부터 받은 초기 메시지로 화면 상태를 동기화
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // 스크롤 제어 (메시지 추가될 때마다 하단으로)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // URL state에 meetingId가 있으면 해당 채팅방 자동 선택
  useEffect(() => {
    if (!isLoading && chatRooms && location.state?.meetingId) {
      const meetingIdFromState = location.state.meetingId;
      const targetRoom = chatRooms.find(
        (room) => room.meetingId === meetingIdFromState,
      );

      if (targetRoom) {
        setSelectedMeeting(targetRoom);
      }
    }
  }, [isLoading, chatRooms, location.state]);

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
    <div className="flex flex-row h-[calc(100vh-80px)] bg-background">
      {/* [왼쪽 패널] 채팅방 목록*/}
      <div
        className={`${selectedMeeting ? "hidden lg:flex" : "flex"} w-full lg:w-[28%] min-w-[300px] flex-col h-full border-r`}
      >
        <div className="p-4 font-semibold shrink-0">
          {nickname ? `${nickname} 님의 채팅` : "로그인이 필요합니다"}
        </div>
        <Separator />
        <div className="flex-grow overflow-y-auto">
          {chatRooms?.map((room) => (
            <div key={room.meetingId} onClick={() => setSelectedMeeting(room)}>
              <ChatRoomItem
                id={room.meetingId}
                meetingImage={room.image}
                meetingTitle={room.title}
                lastMessageContent={
                  room.lastMessage?.content || "대화를 시작하세요"
                }
                lastMessageTime={
                  room.lastMessage?.createdAt
                    ? new Date(room.lastMessage.createdAt).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )
                    : ""
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* [오른쪽 패널] 채팅창 */}
      <div
        className={`${selectedMeeting ? "flex" : "hidden lg:flex"} w-full lg:w-[70%] flex-col h-full bg-card`}
      >
        {selectedMeeting ? (
          <>
            {/* 헤더 */}
            <div className="p-4 border-b shrink-0 flex items-center gap-3">
              <FaArrowLeft
                className="cursor-pointer text-xl"
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
