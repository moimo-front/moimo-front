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

// 모임 데이터 모델 (백엔드에서 조회 시)
export interface Meeting {
    id: number;
    title: string;
    description: string;
    interestName: string; // 관심사(카테고리)
    meetingDate: string; // ISO 8601 format
    location: Location;
    host: Host;
}

// 참가자 정보
export interface Participant {
    id: number;
    name: string;
    profileImageUrl?: string;
    isHost?: boolean;
}

// 모임 상세 정보 (상세 페이지용) - 필요시 확장
export interface MeetingDetail extends Meeting {
    maxParticipants?: number;
    currentParticipants?: number;
    participants?: Participant[];
    imageUrl?: string;
}

// 모임 목록 조회 API 응답 타입
export interface MeetingListResponse {
    meetings: Meeting[];
    total: number;
    page: number;
    limit: number;
}

// 모임 상세 조회 API 응답 타입
export interface MeetingDetailResponse {
    meeting: MeetingDetail;
}

// 모임 생성 API 요청 타입
export interface CreateMeetingRequest {
  title: string;
  description: string;
  interestIds: number; // 백엔드에서 단일 값을 받음
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
