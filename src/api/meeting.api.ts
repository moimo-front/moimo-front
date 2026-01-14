import { apiClient } from "@/api/client";
import type {
  MeetingListResponse,
  CreateMeetingRequest,
  CreateMeetingResponse,
} from "@/models/meeting.model";

export type SortType = "NEW" | "UPDATE" | "DEADLINE" | "POPULAR";
export type InterestFilterType = string;
export type FinishedFilterType = boolean;

export interface GetMeetingsParams {
  page?: number;
  limit?: number;
  sort?: SortType;
  interestFilter?: InterestFilterType;
  finishedFilter?: FinishedFilterType;
}

export const getMeetings = async (
  params?: GetMeetingsParams
): Promise<MeetingListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    // url에 쿼리 적용
    const queryString = queryParams.toString();
    const url = queryString ? `/meetings?${queryString}` : "/meetings";

    const response = await apiClient.get<MeetingListResponse>(url);
    return response.data;
  } catch (error) {
    console.error("getMeetings error:", error);
    throw error;
  }
};

// 이미지 업로드 API (클라우드 업로드)
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<{ imageUrl: string }>(
      "/upload/image", // 클라우드 업로드 API라고 가정
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.imageUrl;
  } catch (error) {
    console.error("uploadImage error:", error);
    throw error;
  }
};

// 모임 생성 API (JSON 형식)
export const createMeeting = async (
  data: CreateMeetingRequest
): Promise<CreateMeetingResponse> => {
  try {
    const response = await apiClient.post<CreateMeetingResponse>("/meetings", {
      title: data.title,
      description: data.description,
      interestIds: data.interestIds, // 배열 그대로
      maxParticipants: data.maxParticipants, // 숫자 그대로
      meetingDate: data.meetingDate,
      address: data.address,
      imageUrl: data.imageUrl, // 클라우드 URL
    });

    return response.data;
  } catch (error) {
    console.error("createMeeting error:", error);
    throw error;
  }
};
