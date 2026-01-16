import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeeting, updateMeeting } from "@/api/meeting.api";
import type { CreateMeetingRequest } from "@/models/meeting.model";

// 모임 생성 훅
export const useCreateMeetingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createMeeting(data),
    onSuccess: () => {
      // 성공 시 모임 목록 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: (error: any) => {
      console.error("모임 생성 실패:", error);
    },
  });
};

// 모임 수정 훅
export const useUpdateMeetingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateMeeting(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meeting", variables.id] });
    },
    onError: (error: any) => {
      console.error("모임 수정 실패:", error);
    },
  });
};
