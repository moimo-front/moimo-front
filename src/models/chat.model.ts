import type { User } from "./user.model";

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  meetingId: number;
  createdAt: string;

  sender: Pick<User, "id" | "email" | "nickname" | "image">;
}
