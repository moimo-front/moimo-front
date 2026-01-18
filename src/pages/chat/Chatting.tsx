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
import type { ChatMessage, ChatRoom } from "@/models/chat.model";
import { useLocation } from "react-router-dom";
import type { VerifyUserResponse } from "@/api/auth.api";

const Chatting = () => {
  const { nickname, userId } = useAuthStore();
  const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const queryClient = useQueryClient();

  // Component-owned state for messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 채팅방 목록 조회
  const { data: chatRooms, isSuccess } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: getChatRooms,
  });

  // 2. 새로운 메시지를 처리하는 콜백 (useChatSocket에 전달)
  const handleNewMessage = useCallback(
    (newMessage: ChatMessage) => {
      // 자신의 메시지는 브로드캐스트에서 무시 (낙관적 업데이트로 이미 처리됨)
      if (newMessage.senderId === userId) {
        return;
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
    [userId],
  );

  // 3. 소켓 Hook 연결 및 초기 메시지 목록 가져오기
  const { initialMessages, sendMessage } = useChatSocket(
    selectedMeeting?.meetingId || null,
    handleNewMessage,
  );

  // 4. 초기 메시지 목록을 상태에 동기화
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // 스크롤 제어
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 방 입장 시 초기 방 선택 (라우터 state로부터)
  useEffect(() => {
    if (isSuccess && chatRooms && location.state?.meetingId) {
      const roomToSelect = chatRooms.find(
        (room) => room.meetingId === location.state.meetingId,
      );
      if (roomToSelect) {
        setSelectedMeeting(roomToSelect);
      }
    }
  }, [isSuccess, chatRooms, location.state]);

  // 메시지 전송 핸들러 (낙관적 업데이트 포함)
  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedMeeting) return;

    const userData = queryClient.getQueryData<VerifyUserResponse>(["authUser"]);
    const profileImage = userData?.profile_image || "";

    const optimisticMessage: ChatMessage = {
      id: Date.now(),
      content: inputValue,
      meetingId: selectedMeeting.meetingId,
      senderId: userId!,
      createdAt: new Date().toISOString(),
      sender: {
        id: userId!,
        nickname: nickname || "You",
        profile_image: profileImage,
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    sendMessage(inputValue);
    setInputValue("");

    // 쿼리 무효화로 lastMessage 업데이트
    queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSendMessage();
    }
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
          {chatRooms?.map((room) => (
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
                        { hour: "2-digit", minute: "2-digit" },
                      )
                    : ""
                }
              />
            </div>
          ))}
          {isSuccess && chatRooms?.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <p>참여 중인 모임이 없습니다.</p>
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
            <div
              ref={scrollRef}
              className="flex flex-col gap-4 p-4 flex-grow overflow-y-auto"
            >
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
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
