// src/mock/meetingHandler.ts
import { http, HttpResponse, delay } from "msw";
import { mockMeetings, httpUrl } from "./mockData";
import type { MeetingMeta } from "@/models/meeting.model";

export const meetingHandler = [
  http.get(`${httpUrl}/meetings/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;

    // mockMeetings 또는 myMeetings에서 찾기
    const meeting = mockMeetings.find(m => m.meetingId === Number(id)); // Using mockMeetings as base

    // detail용 가짜 데이터 추가
    if (meeting) {
      return HttpResponse.json({
        id: meeting.meetingId,
        title: meeting.title,
        description: "이것은 모임 상세 설명입니다. 자유롭게 수정해보세요!",
        maxParticipants: meeting.maxParticipants,
        meetingDate: meeting.meetingDate,
        address: meeting.address,
        latitude: 37.5665,
        longitude: 126.9780,
        hostId: 1, // Mock host ID
        createdAt: new Date().toISOString(),
        // MeetingDetail에는 없지만 프론트에서 필요한 추가 필드가 있다면 여기서 처리 (예: interestIds, imageUrl)
        // 하지만 MeetingDetail 타입에 맞춰야 함.
        // 현재 MeetingDetail에는 imageUrl, interestIds가 없음. 모델 수정 필요 가능성 있음.
      } as any, { status: 200 }); // Type assertion for now if fields are missing in MeetingDetail
    }

    // myMeetings에서 찾기 (HostMeeting에서 클릭 시 이쪽일 가능성 높음)
    // 실제로는 myMeetings도 상세 조회 API를 통해 데이터를 가져와야 함.
    // 여기서는 간단히 mock response 리턴

    return HttpResponse.json({
      id: Number(id),
      title: "Mock Detail Title",
      description: "상세 설명 Mock 데이터입니다.",
      maxParticipants: 10,
      meetingDate: new Date().toISOString(),
      address: "서울 어딘가",
      latitude: 37.0,
      longitude: 127.0,
      hostId: 1,
      createdAt: new Date().toISOString(),
      // 추가 필드 Mocking
      imageUrl: "https://via.placeholder.com/150",
      interestIds: [1, 2]
    }, { status: 200 });
  }),
  http.get(`${httpUrl}/meetings`, async ({ request }) => {
    await delay(500);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    // const interestName = url.searchParams.get("interestName");

    // 필터링 로직
    // let filteredMeetings = mockMeetings;
    // if (interestName) {
    //   filteredMeetings = mockMeetings.filter(
    //     (meeting) => meeting.interestName === interestName
    //   );
    // }

    // 페이지네이션 로직
    // const totalCount = filteredMeetings.length;
    // const totalPages = Math.ceil(totalCount / limit);
    // const startIndex = (page - 1) * limit;
    // const endIndex = startIndex + limit;
    // const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex);

    const totalCount = mockMeetings.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMeetings = mockMeetings.slice(startIndex, endIndex);

    const meta: MeetingMeta = {
      totalCount,
      totalPages,
      currentPage: page,
    };

    return HttpResponse.json(
      {
        data: paginatedMeetings,
        meta: meta,
      },
      { status: 200 }
    );
  }),
];
