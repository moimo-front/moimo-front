import type { Participant, ParticipationStatus } from "@/models/participation.model";
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

// 모임 참여자 상태 일괄 업데이트
export const updateParticipation = async (meetingId: number, updates: { participationId: number, status: ParticipationStatus }[]) => {
    try {
        const response = await apiClient.put(`/meetings/${meetingId}/participations`, updates);
        return response.data;
    } catch (error) {
        console.error("Error updating participation:", error);
        throw error;
    }
};