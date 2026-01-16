import type { Participant } from "@/models/participation.model";
import { apiClient } from "./client";


// 내 모임 참여자 목록 조회
export const getParticipants = async (meetingId: number) => {
    try {
        const response = await apiClient.get<Participant[]>(`/meetings/${meetingId}/participations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
};