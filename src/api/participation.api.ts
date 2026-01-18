import type { Participant, ParticipationStatus } from "@/models/participation.model";
import { apiClient } from "./client";


// 내 모임 참여자 목록 조회 (API 권한 문제로 인한 임시 Mock 데이터 사용)
export const getParticipants = async (meetingId: number) => {
    // TODO: 백엔드 API 권한 수정되면 실제 API 호출로 변경
    return new Promise<Participant[]>((resolve) => {
        setTimeout(() => {
            resolve([
                // 호스트 (테스터1)
                {
                    participationId: 1,
                    userId: 15, // 예시 ID
                    nickname: "테스터1",
                    profileImage: null,
                    status: "ACCEPTED",
                    bio: "모이머의 자기소개",
                    interests: []
                },
                // 게스트 1
                {
                    participationId: 2,
                    userId: 101,
                    nickname: "모이미1",
                    profileImage: null,
                    status: "ACCEPTED",
                    bio: "참여자1입니다",
                    interests: []
                },
                // 게스트 2
                {
                    participationId: 3,
                    userId: 102,
                    nickname: "모이미2",
                    profileImage: null,
                    status: "ACCEPTED",
                    bio: "참여자2입니다",
                    interests: []
                },
                // 대기중인 게스트 (표시 안 됨)
                {
                    participationId: 4,
                    userId: 103,
                    nickname: "대기자1",
                    profileImage: null,
                    status: "PENDING",
                    bio: "승인 대기중",
                    interests: []
                }
            ]);
        }, 500); // 0.5초 딜레이 시뮬레이션
    });

    /* 실제 API 호출 코드 (잠시 주석 처리)
    try {
        const response = await apiClient.get<Participant[]>(`/meetings/${meetingId}/participations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
    */
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