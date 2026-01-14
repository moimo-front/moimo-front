// src/mock/meetingHandler.ts
import { http, HttpResponse, delay } from "msw";
import { mockMeetings, httpUrl } from "./mockData";
import type { MeetingMeta } from "@/models/meeting.model";

export const meetingHandler = [
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
