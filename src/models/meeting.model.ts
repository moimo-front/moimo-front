// 위치 정보
export interface Location {
    address: string;
    lat: number;
    lng: number;
}

// 호스트 정보
export interface Host {
    nickname: string;
    bio: string;
}

// 참가자 정보
export interface Participant {
    id: number;
    name: string;
    profileImageUrl?: string;
    isHost?: boolean;
}

// 모임 목록용 (간단한 정보)
export interface Meeting {
  meetingId: number;
  title: string;
  interestName: string;
  maxParticipants: number;
  currentParticipants: number;
  address: string;
  meetingDate: string;
}

// 모임 상세 정보
export interface MeetingDetail {
  id: number;
  title: string;
  description: string;
  interestName: string;
  maxParticipants: number;
  currentParticipants?: number;
  meetingDate: string;
  location: Location;
  host: Host;
  participants?: Participant[];
  imageUrl?: string;
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
  meetingImage?: string;
  description: string;
  interestName: string;
  maxParticipants: number;
  currentParticipants: number;
  meetingDate: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  host: {
    nickname: string;
    bio: string;
    hostImage?: string;
  };
}

// 모임 생성 API 요청 타입
export interface CreateMeetingRequest {
  title: string;
  description: string;
  interestId: number;
  maxParticipants: number;
  meetingDate: string;
  address: string;
  meetingImage?: string; // 클라우드 이미지 URL
}

// 모임 생성 API 응답 타입
export interface CreateMeetingResponse {
  success: boolean;
  meetingId: number;
  message: string;
}
