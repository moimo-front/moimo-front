import type { MyMeetingsResponse } from "@/api/me.api";
import type { Interest } from "@/models/interest.model";
import type { Meeting } from "@/models/meeting.model"; // Meeting 타입 import

export const httpUrl =
  import.meta.env.VITE_API_URL || "https://moimo-back.vercel.app";

export const interestCategories: Interest[] = [
  {
    id: 1,
    name: "인간관계(친목)",
  },
  {
    id: 2,
    name: "술",
  },
  {
    id: 3,
    name: "자기계발/공부",
  },
  {
    id: 4,
    name: "예술",
  },
  {
    id: 5,
    name: "스포츠/운동",
  },
  {
    id: 6,
    name: "음식",
  },
  {
    id: 7,
    name: "라이프",
  },
  {
    id: 8,
    name: "공예/만들기",
  },
  {
    id: 9,
    name: "책/글쓰기/독서",
  },
  {
    id: 10,
    name: "차/음료",
  },
  {
    id: 11,
    name: "커리어/직장",
  },
  {
    id: 12,
    name: "재테크",
  },
  {
    id: 13,
    name: "반려동물",
  },
  {
    id: 14,
    name: "게임/액티비티",
  },
  {
    id: 15,
    name: "여행",
  },
  {
    id: 16,
    name: "심리/상담",
  },
  {
    id: 17,
    name: "인테리어/가구",
  },
  {
    id: 18,
    name: "건강",
  },
  {
    id: 19,
    name: "환경",
  },
  {
    id: 20,
    name: "엔터",
  },
  {
    id: 21,
    name: "미용",
  },
  {
    id: 22,
    name: "트렌드",
  },
  {
    id: 23,
    name: "연애/이성관계",
  },
  {
    id: 24,
    name: "식물/자연",
  },
];

export const mockMeetings: Meeting[] = Array.from({ length: 25 }, (_, i) => ({
  meetingId: i + 1,
  title: `모임 제목 ${i + 1}`,
  interestName: i % 2 === 0 ? "자기계발/공부" : "스포츠/운동",
  maxParticipants: 10,
  currentParticipants: i % 10,
  address: `서울시 강남구 역삼동 ${i + 1}번지`,
  meetingDate: `2024-03-${String((i % 28) + 1).padStart(2, '0')}T1${i % 9}:00:00`,
}));

export const myMeetings: MyMeetingsResponse[] = [
  {
    meetingId: 1,
    title: "부산대학교 러닝 크루 모집",
    interestName: "스포츠/운동",
    maxParticipants: 8,
    currentParticipants: 1,
    address: "부산광역시 수영구 광안해변로 219",
    meetingDate: "2026-02-14T19:00:00.000Z",
    status: "ACCEPTED",
    isHost: true,
    isCompleted: false
  },
  {
    meetingId: 101,
    title: "같이 축구보고 게임해요!",
    interestName: "스포츠/운동",
    address: "이태원",
    meetingDate: "2024-01-15T19:00:00Z",
    currentParticipants: 2,
    maxParticipants: 52,
    status: "ACCEPTED",
    isHost: false,
    isCompleted: false
  },
  {
    meetingId: 102,
    title: "보라매공원 경찰과 도둑 할 사람",
    interestName: "스포츠/운동",
    address: "보라매공원",
    meetingDate: "2024-01-07T19:00:00Z",
    currentParticipants: 12,
    maxParticipants: 52,
    status: "PENDING",
    isHost: false,
    isCompleted: false
  },
  {
    meetingId: 103,
    title: "내가 만든 모임1",
    interestName: "스포츠/운동",
    address: "우리집",
    meetingDate: "2024-01-06T19:00:00Z",
    currentParticipants: 12,
    maxParticipants: 52,
    status: "ACCEPTED",
    isHost: true,
    isCompleted: true
  },
  {
    meetingId: 104,
    title: "크리스마스 기념 정모",
    interestName: "스포츠/운동",
    address: "이태원",
    meetingDate: "2023-12-25T19:00:00Z",
    currentParticipants: 12,
    maxParticipants: 52,
    status: "ACCEPTED",
    isHost: false,
    isCompleted: true
  },
  {
    meetingId: 105,
    title: "크리스마스 기념 정모",
    interestName: "스포츠/운동",
    address: "이태원",
    meetingDate: "2023-12-25T19:00:00Z",
    currentParticipants: 12,
    maxParticipants: 52,
    status: "ACCEPTED",
    isHost: false,
    isCompleted: true
  },
  {
    meetingId: 106,
    title: "내가 만든 모임2",
    interestName: "스포츠/운동",
    address: "우리집",
    currentParticipants: 12,
    maxParticipants: 20,
    meetingDate: "2024-01-26T19:00:00Z",
    status: "ACCEPTED",
    isHost: true,
    isCompleted: false,
  }
];