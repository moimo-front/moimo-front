import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
    approveParticipation,
    rejectParticipation,
    approveAllParticipations,
    cancelApprovalParticipation,
    cancelRejectParticipation
} from "@/api/participation.api";
import type { Participant } from "@/models/participation.model";
import type { MeetingDetail } from "@/models/meeting.model";

// 공통 낙관적 업데이트 스냅샷 타입
interface MutationContext {
    previousParticipants?: Participant[];
    previousMeeting?: MeetingDetail;
    meetingId: number;
}

// 개별 승인 Mutation
export const useApproveParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }, MutationContext>({
        mutationFn: ({ meetingId, participationId }) =>
            approveParticipation(meetingId, participationId),

        // 1. 발송된 요청과 겹치지 않게 관련 쿼리 취소
        onMutate: async ({ meetingId, participationId }) => {
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });

            // 2. 이전 데이터 스냅샷 저장
            const previousParticipants = queryClient.getQueryData<Participant[]>(["participants", meetingId]);
            const previousMeeting = queryClient.getQueryData<MeetingDetail>(["meeting", meetingId]);

            // 3. 낙관적 업데이트: 상태 ACCEPTED로 변경
            if (previousParticipants) {
                queryClient.setQueryData<Participant[]>(["participants", meetingId], (old) =>
                    old?.map(p => p.participationId === participationId ? { ...p, status: 'ACCEPTED' } : p)
                );
            }

            // 낙관적 업데이트: 인원수 +1 (이미 ACCEPTED가 아닐 경우만)
            if (previousMeeting && previousParticipants) {
                const p = previousParticipants.find(p => p.participationId === participationId);
                if (p && p.status !== 'ACCEPTED') {
                    queryClient.setQueryData<MeetingDetail>(["meeting", meetingId], (old) =>
                        old ? { ...old, currentParticipants: old.currentParticipants + 1 } : old
                    );
                }
            }

            return { previousParticipants, previousMeeting, meetingId };
        },

        // 4. 에러 발생 시 저장해둔 스냅샷으로 롤백
        onError: (_, __, context) => {
            if (context) {
                queryClient.setQueryData(["participants", context.meetingId], context.previousParticipants);
                queryClient.setQueryData(["meeting", context.meetingId], context.previousMeeting);
            }
        },

        // 5. 성공/실패 여부와 관계없이 실행 (데이터 무효화)
        onSettled: (_, __, context) => {
            if (context) {
                queryClient.invalidateQueries({ queryKey: ["participants", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["meeting", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            }
        },
    });
};

// 개별 거절 Mutation
export const useRejectParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }, MutationContext>({
        mutationFn: ({ meetingId, participationId }) =>
            rejectParticipation(meetingId, participationId),

        onMutate: async ({ meetingId, participationId }) => {
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });

            const previousParticipants = queryClient.getQueryData<Participant[]>(["participants", meetingId]);
            const previousMeeting = queryClient.getQueryData<MeetingDetail>(["meeting", meetingId]);

            // 낙관적 업데이트: 상태 REJECTED로 변경
            if (previousParticipants) {
                queryClient.setQueryData<Participant[]>(["participants", meetingId], (old) =>
                    old?.map(p => p.participationId === participationId ? { ...p, status: 'REJECTED' } : p)
                );
            }

            // 낙관적 업데이트: ACCEPTED에서 REJECTED로 변할 경우만 인원수 -1 (보통 PENDING에서 오므로 생략 가능하나 안전장치로 추가)
            if (previousMeeting && previousParticipants) {
                const p = previousParticipants.find(p => p.participationId === participationId);
                if (p && p.status === 'ACCEPTED') {
                    queryClient.setQueryData<MeetingDetail>(["meeting", meetingId], (old) =>
                        old ? { ...old, currentParticipants: old.currentParticipants - 1 } : old
                    );
                }
            }

            return { previousParticipants, previousMeeting, meetingId };
        },

        onError: (_, __, context) => {
            if (context) {
                queryClient.setQueryData(["participants", context.meetingId], context.previousParticipants);
                queryClient.setQueryData(["meeting", context.meetingId], context.previousMeeting);
            }
        },

        onSettled: (_, __, context) => {
            if (context) {
                queryClient.invalidateQueries({ queryKey: ["participants", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["meeting", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            }
        },
    });
};

// 전체 승인 Mutation
export const useApproveAllParticipations = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number }, MutationContext>({
        mutationFn: ({ meetingId }) => approveAllParticipations(meetingId),

        onMutate: async ({ meetingId }) => {
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });

            const previousParticipants = queryClient.getQueryData<Participant[]>(["participants", meetingId]);
            const previousMeeting = queryClient.getQueryData<MeetingDetail>(["meeting", meetingId]);

            // 낙관적 업데이트: 모든 PENDING을 ACCEPTED로 변경
            if (previousParticipants) {
                queryClient.setQueryData<Participant[]>(["participants", meetingId], (old) =>
                    old?.map(p => p.status === 'PENDING' ? { ...p, status: 'ACCEPTED' } : p)
                );
            }

            // 낙관적 업데이트: PENDING 수만큼 인원수 증가
            if (previousMeeting && previousParticipants) {
                const pendingCount = previousParticipants.filter(p => p.status === 'PENDING').length;
                if (pendingCount > 0) {
                    queryClient.setQueryData<MeetingDetail>(["meeting", meetingId], (old) =>
                        old ? { ...old, currentParticipants: old.currentParticipants + pendingCount } : old
                    );
                }
            }

            return { previousParticipants, previousMeeting, meetingId };
        },

        onError: (_, __, context) => {
            if (context) {
                queryClient.setQueryData(["participants", context.meetingId], context.previousParticipants);
                queryClient.setQueryData(["meeting", context.meetingId], context.previousMeeting);
            }
        },

        onSettled: (_, __, context) => {
            // 5. 성공/실패 여부와 관계없이 실행 (데이터 무효화)
            if (context) {
                queryClient.invalidateQueries({ queryKey: ["participants", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["meeting", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            }
        },
    });
};

// 승인 취소 Mutation
export const useCancelApprovalParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }, MutationContext>({
        mutationFn: ({ meetingId, participationId }) =>
            cancelApprovalParticipation(meetingId, participationId),

        onMutate: async ({ meetingId, participationId }) => {
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });

            const previousParticipants = queryClient.getQueryData<Participant[]>(["participants", meetingId]);
            const previousMeeting = queryClient.getQueryData<MeetingDetail>(["meeting", meetingId]);

            // 낙관적 업데이트: 상태 PENDING으로 변경
            if (previousParticipants) {
                queryClient.setQueryData<Participant[]>(["participants", meetingId], (old) =>
                    old?.map(p => p.participationId === participationId ? { ...p, status: 'PENDING' } : p)
                );
            }

            // 낙관적 업데이트: 인원수 -1
            if (previousMeeting && previousParticipants) {
                const p = previousParticipants.find(p => p.participationId === participationId);
                if (p && p.status === 'ACCEPTED') {
                    queryClient.setQueryData<MeetingDetail>(["meeting", meetingId], (old) =>
                        old ? { ...old, currentParticipants: old.currentParticipants - 1 } : old
                    );
                }
            }

            return { previousParticipants, previousMeeting, meetingId };
        },

        onSettled: (_, __, context) => {
            if (context) {
                queryClient.invalidateQueries({ queryKey: ["participants", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["meeting", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            }
        },
    });
};

// 거절 취소 Mutation
export const useCancelRejectParticipation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { meetingId: number, participationId: number }, MutationContext>({
        mutationFn: ({ meetingId, participationId }) =>
            cancelRejectParticipation(meetingId, participationId),

        onMutate: async ({ meetingId, participationId }) => {
            await queryClient.cancelQueries({ queryKey: ["participants", meetingId] });
            await queryClient.cancelQueries({ queryKey: ["meeting", meetingId] });

            const previousParticipants = queryClient.getQueryData<Participant[]>(["participants", meetingId]);
            const previousMeeting = queryClient.getQueryData<MeetingDetail>(["meeting", meetingId]);

            // 낙관적 업데이트: 상태 PENDING으로 변경
            if (previousParticipants) {
                queryClient.setQueryData<Participant[]>(["participants", meetingId], (old) =>
                    old?.map(p => p.participationId === participationId ? { ...p, status: 'PENDING' } : p)
                );
            }

            return { previousParticipants, previousMeeting, meetingId };
        },

        onError: (_, __, context) => {
            if (context) {
                queryClient.setQueryData(["participants", context.meetingId], context.previousParticipants);
                queryClient.setQueryData(["meeting", context.meetingId], context.previousMeeting);
            }
        },

        onSettled: (_, __, context) => {

            if (context) {
                queryClient.invalidateQueries({ queryKey: ["participants", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["meeting", context.meetingId] });
                queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            }
        },
    });
};