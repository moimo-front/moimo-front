export interface ChatMessage {
    id: number;
    content: string;
    senderId: number;
    meetingId: number;
    createdAt: Date;
}