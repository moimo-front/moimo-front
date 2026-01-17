import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateParticipation } from "@/api/participation.api";
import type { Participant, ParticipationStatus } from "@/models/participation.model";
import type { MeetingDetail } from "@/models/meeting.model";

export const useUpdateParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ meetingId, updates }:
            { meetingId: number, updates: { participationId: number, status: ParticipationStatus }[] }) =>
            updateParticipation(meetingId, updates),

        onMutate: async ({ meetingId, updates }) => {
            // 1. 발송된 요청과 겹치지 않게 관련 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });

            // 2. 이전 데이터 스냅샷 저장
            const previousParticipants = queryClient.getQueryData<Participant[]>(["participants", meetingId]);
            const previousMeeting = queryClient.getQueryData<MeetingDetail>(["meeting", meetingId]);

            // 3. 낙관적 업데이트: 참여자 목록 상태 변경
            if (previousParticipants) {
                queryClient.setQueryData<Participant[]>(["participants", meetingId], (old) => {
                    if (!old) return [];
                    return old.map(p => {
                        const update = updates.find(u => u.participationId === p.participationId);
                        return update ? { ...p, status: update.status } : p;
                    });
                });
            }

            // 4. 낙관적 업데이트: 모임 인원수 계산 및 반영
            if (previousMeeting && previousParticipants) {
                let diff = 0;
                updates.forEach(update => {
                    const prev = previousParticipants.find(p => p.participationId === update.participationId);
                    if (prev) {
                        if (prev.status !== "ACCEPTED" && update.status === "ACCEPTED") diff++;
                        else if (prev.status === "ACCEPTED" && update.status !== "ACCEPTED") diff--;
                    }
                });

                if (diff !== 0) {
                    queryClient.setQueryData<MeetingDetail>(["meeting", meetingId], (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            currentParticipants: old.currentParticipants + diff
                        };
                    });
                }
            }

            return { previousParticipants, previousMeeting, meetingId };
        },

        onError: (error: AxiosError, _, context) => {
            console.error("Error updating participation:", error);
            // 에러 발생 시 원래 데이터로 복구
            if (context) {
                queryClient.setQueryData(["participants", context.meetingId], context.previousParticipants);
                queryClient.setQueryData(["meeting", context.meetingId], context.previousMeeting);
            }
        },

        onSettled: (_, __, variables) => {
            // 성공/실패 여부와 관계없이 서버 데이터와 동기화
            queryClient.invalidateQueries({ queryKey: ["participants", variables.meetingId] });
            queryClient.invalidateQueries({ queryKey: ["meeting", variables.meetingId] });
            // 내 모임 목록도 인원수가 바뀔 수 있으므로 무효화
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
        },
    });
};