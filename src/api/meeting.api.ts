import { apiClient } from "@/api/client";
import type { MeetingListResponse } from "@/models/meeting.model";

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
