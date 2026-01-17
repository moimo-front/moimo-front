import { chatApiClient } from "./client";
import type { ChatMessageResponse, ChatRoom } from "@/models/chat.model";

// 메세지 목록 조회
export const getMessages = async (
  meetingId: number
): Promise<ChatMessageResponse> => {
  const response = await chatApiClient.get<ChatMessageResponse>(
    `/chats/${meetingId}/messages`
  );

  return response.data;
};

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await chatApiClient.get<ChatRoom[]>("/chats/rooms");

  return response.data;
};
