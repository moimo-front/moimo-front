import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/models/chat.model";

const SOCKET_URL = "https://moimo-back.onrender.com";

export const useChatSocket = (meetingId: number | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, userId } = useAuthStore();

  useEffect(() => {
    if (!meetingId || !accessToken) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

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
      }
    };
  }, [meetingId, accessToken]);

  const sendMessage = (content: string) => {
    if (socketRef.current && meetingId && userId) {
      const payload = {
        meetingId,
        senderId: userId,
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
