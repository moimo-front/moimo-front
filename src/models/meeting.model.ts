// 모임 데이터 모델 (백엔드에서 조회 시)
export interface Meeting {
  meetingId: number;
  title: string;
  interestName: string;
  maxParticipants: number;
  currentParticipants: number;
  address: string;
  meetingDate: string;
}

export interface MeetingMeta {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MeetingListResponse {
  data: Meeting[];
  meta: MeetingMeta;
}

export interface MeetingDetail {
  id: number;
  title: string;
  description: string;
  maxParticipants: number;
  meetingDate: string;
  address: string;
  latitude: number;
  longitude: number;
  hostId: number;
  createdAt: string;
  updatedAt?: string;
}

// 모임 생성 API 요청 타입
export interface CreateMeetingRequest {
  title: string;
  description: string;
  interestIds: number[];
  maxParticipants: number;
  meetingDate: string; // ISO 8601 format
  address: string;
  imageUrl?: string; // 클라우드 이미지 URL
}

// 모임 생성 API 응답 타입
export interface CreateMeetingResponse {
  success: boolean;
  meetingId: number;
  message: string;
}
