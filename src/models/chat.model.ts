import type { User } from "./user.model";

// 채팅 메세지 타입
export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  meetingId: number;
  createdAt: string;

  sender?: Pick<User, "id" | "email" | "nickname" | "profile_image">;
}

// 채팅방 타입
export interface ChatRoom {
  id: number;
  title: string;
  image?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}
