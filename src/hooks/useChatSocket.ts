import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/models/chat.model";
import { createMockSocket } from "@/mock/socketMock";

// Mocking 활성화 조건
const isMockingEnabled =
  import.meta.env.DEV &&
  (import.meta.env.VITE_ENABLE_MOCK || "true") === "true";

export const useChatSocket = (meetingId: number | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketRef = useRef<any | null>(null);
  const { accessToken, userId } = useAuthStore();

  useEffect(() => {
    if (!meetingId) return;

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

    socketRef.current.emit("joinRoom", meetingId);
    console.log(`Socket connected to room: ${meetingId}`);

    socketRef.current.on("newMessage", (message: ChatMessage) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
        socketRef.current = null;
      }
    };
  }, [meetingId, accessToken]);

  const sendMessage = (content: string) => {
    if (socketRef.current && meetingId && (userId || isMockingEnabled)) {
      const payload = {
        meetingId,
        senderId: userId || 0, // Mocking 시 userId가 없을 수 있음
        content,
      };
      socketRef.current.emit("sendMessage", payload);
    } else {
      console.error(
        "Cannot send message: Missing socket, meetingId, or userId"
      );
    }
  };

  return { messages, setMessages, sendMessage };
};
