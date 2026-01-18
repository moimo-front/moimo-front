import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/models/chat.model";
import { createMockSocket } from "@/mock/socketMock";

type MockSocketType = ReturnType<typeof createMockSocket>;

// Mocking 설정
const isMockingEnabled =
  import.meta.env.DEV &&
  (import.meta.env.VITE_ENABLE_MOCK || "true") === "true";

// 소켓 인스턴스 팩토리
const getSocketInstance = (accessToken: string | null): Socket | MockSocketType | null => {
  if (isMockingEnabled) {
    return createMockSocket();
  }

  if (!accessToken) return null;

  return io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token: accessToken },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
  });
};

export const useChatSocket = (
  meetingId: number | null,
  onNewMessage: (message: ChatMessage) => void
) => {
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);

  const socketRef = useRef<Socket | MockSocketType | null>(null);
  
  // 리스너 재등록 방지를 위한 핸들러 Ref
  const onNewMessageRef = useRef(onNewMessage);
  const { accessToken, userId } = useAuthStore();

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  // 1. 소켓 연결 관리 (앱 시작/토큰 변경 시 1회 실행)
  useEffect(() => {
    // 싱글턴 유지
    if (socketRef.current) return;

    const socket = getSocketInstance(accessToken);
    if (!socket) return;

    socketRef.current = socket;

    // --- 공통 이벤트 리스너 등록 ---
    socket.on("connect", () => {
      console.log(`Socket connected: ${socket.id}`);
    });

    socket.on("disconnect", (reason: string) => {
      console.log(`Socket disconnected: ${reason}`);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });

    // 메시지 수신 리스너 (전역적으로 한 번만 등록)
    socket.on("newMessage", (message: ChatMessage) => {
      console.log("New message received:", message);
      if (onNewMessageRef.current) {
        onNewMessageRef.current(message);
      }
    });

    // 컴포넌트가 언마운트되거나 토큰이 아예 바뀔 때만 연결 해제
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken]);

  // 2. 방 입장 및 데이터 조회 (meetingId가 바뀔 때 실행)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !meetingId) {
      setInitialMessages([]);
      return;
    }

    console.log(`Switching to room: ${meetingId}`);

    // 방 입장 요청
    socket.emit("joinRoom", meetingId, (response: any) => {
      console.log(`방 ${meetingId} 입장 응답:`, response);
    });

    // 메시지 목록 요청
    socket.emit(
      "getMessages",
      meetingId,
      (response: { meetingId: number; messages: ChatMessage[] }) => {
        console.log("메시지 목록 응답:", response);
        if (response && response.messages) {
          setInitialMessages(response.messages);
        }
      }
    );
    
  }, [meetingId]); // meetingId가 바뀔 때만 실행됨

  // 메시지 전송 함수
  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && meetingId && (userId || isMockingEnabled)) {
      const payload = {
        meetingId,
        content,
      };
      console.log("Emitting sendMessage with payload:", payload);
      
      socketRef.current.emit("sendMessage", payload, (response: any) => {
        console.log("메시지 전송 응답:", response);
      });
    } else {
      console.error(
        "Cannot send message: Missing socket, meetingId, or userId"
      );
    }
  }, [meetingId, userId]);

  return { initialMessages, sendMessage };
};