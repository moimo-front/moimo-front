import type { Interest } from "@/models/interest.model";
import type { Meeting } from "@/models/meeting.model";

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

export const mockMeetings: Meeting[] = Array.from({ length: 25 }, (_, i) => {
  const interestName = i % 2 === 0 ? "자기계발/공부" : "스포츠/운동";
  const interestId = interestCategories.find(
    (cat) => cat.name === interestName
  )?.id;

  return {
    meetingId: i + 1,
    title: `모임 제목 ${i + 1}`,
    interestName: interestName,
    interestId: interestId || 1,
    maxParticipants: 10,
    currentParticipants: i % 10,
    address: `서울시 강남구 역삼동 ${i + 1}번지`,
    meetingDate: `2024-03-${(i % 28) + 1}T1${i % 9}:00:00`,
    meetingStatus: "OPEN",
  };
});
