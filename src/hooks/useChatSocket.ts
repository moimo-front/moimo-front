import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/models/chat.model";
import { createMockSocket } from "@/mock/socketMock";

// Mocking 활성화 조건
const isMockingEnabled =
  import.meta.env.DEV &&
  (import.meta.env.VITE_ENABLE_MOCK || "true") === "true";

export const useChatSocket = (
  meetingId: number | null,
  onNewMessage: (message: ChatMessage) => void,
) => {
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketRef = useRef<any | null>(null);
  const { accessToken, userId } = useAuthStore();

  useEffect(() => {
    if (!meetingId) {
      setInitialMessages([]); // meetingId가 없으면 초기 메시지 초기화
      return;
    }

    // 목업 환경일 경우 가짜 소켓 사용, 그렇지 않으면 실제 소켓 연결
    if (isMockingEnabled) {
      if (!socketRef.current) {
        socketRef.current = createMockSocket();
      }
    } else {
      if (!accessToken) return;

      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token: accessToken },
        transports: ["websocket"],
      });
    }

    // 소켓 이벤트 로깅
    socketRef.current.on("connect", () => {
      console.log(`Socket connected: ${socketRef.current.id}`);
      socketRef.current.emit("joinRoom", meetingId, (response: any) => {
        console.log("방 입장 응답:", response);
      });
      console.log(`Socket joined room: ${meetingId}`);

      // 방 입장 후 메시지 목록 요청
      socketRef.current.emit("getMessages", meetingId, (response: { meetingId: number, messages: ChatMessage[] }) => {
        console.log("메시지 목록 응답:", response);
        setInitialMessages(response.messages);
      });
    });

    socketRef.current.on("disconnect", (reason: string) => {
      console.log(`Socket disconnected: ${reason}`);
    });

    socketRef.current.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });

    // newMessage 리스너는 connect 이벤트와 독립적으로 유지
    socketRef.current.on("newMessage", (message: ChatMessage) => {
      console.log("New message received:", message);
      onNewMessage(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
        socketRef.current = null;
      }
    };
  }, [meetingId, accessToken, onNewMessage]);

  const sendMessage = (content: string) => {
    if (socketRef.current && meetingId && (userId || isMockingEnabled)) {
      const payload = {
        meetingId,
        content,
      };
      console.log("Emitting sendMessage with payload:", payload);
      socketRef.current.emit("sendMessage", payload, (response: any) => {
        console.log("메시지 전송 응답:", response);
        // 여기서 응답으로 받은 메시지 ID 등을 활용하여 낙관적 업데이트 메시지 대체 가능
      });
    } else {
      console.error(
        "Cannot send message: Missing socket, meetingId, or userId",
      );
    }
  };

  return { initialMessages, sendMessage };
};
