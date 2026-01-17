import { apiClient } from "@/api/client";
import type {
  MeetingListResponse,
  MeetingDetail,
  CreateMeetingResponse,
} from "@/models/meeting.model";

export type SortType = "NEW" | "UPDATE" | "DEADLINE";
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

// 모임 상세 조회 API
export const getMeetingById = async (
  meetingId: string | number
): Promise<MeetingDetail> => {
  try {
    const response = await apiClient.get<MeetingDetail>(
      `/meetings/${meetingId}`
    );
    console.log("📡 API 응답 (meeting.api.ts):", response.data);
    return response.data; // 백엔드가 직접 모임 데이터를 반환
  } catch (error) {
    console.error("getMeetingById error:", error);
    throw error;
  }
};

// 이미지 업로드 API (클라우드 업로드)
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<{ imageUrl: string }>(
      "/upload/image", // 클라우드 업로드 API
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

// 모임 생성 API (multipart/form-data 형식)
export const createMeeting = async (
  data: FormData
): Promise<CreateMeetingResponse> => {
  try {
    const response = await apiClient.post<CreateMeetingResponse>(
      "/meetings",
      data
    );

    return response.data;
  } catch (error) {
    console.error("createMeeting error:", error);
    throw error;
  }
};

// 모임 수정 API (multipart/form-data 형식)
export const updateMeeting = async (
  meetingId: number,
  data: FormData
): Promise<CreateMeetingResponse> => {
  try {
    const response = await apiClient.put<CreateMeetingResponse>(
      `/meetings/${meetingId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("updateMeeting error:", error);
    throw error;
  }
};
