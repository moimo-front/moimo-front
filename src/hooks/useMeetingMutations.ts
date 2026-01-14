import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeeting } from "@/api/meeting.api";
import type { CreateMeetingRequest } from "@/models/meeting.model";

// 모임 생성 훅
export const useCreateMeetingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeetingRequest) => createMeeting(data),
    onSuccess: () => {
      // 성공 시 모임 목록 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: (error: any) => {
      console.error("모임 생성 실패:", error);
    },
  });
};
