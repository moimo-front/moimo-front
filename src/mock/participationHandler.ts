import { http, HttpResponse, delay } from 'msw';
import { httpUrl, myMeetings, mockParticipants } from './mockData';

// 모임 참여자 목록 조회 핸들러
const getParticipants = http.get(`${httpUrl}/meetings/:meetingId/participations`, async ({ params }) => {
    await delay(1000);

    const { meetingId } = params;
    const mid = Number(meetingId);

    const meeting = myMeetings.find(m => m.meetingId === mid);
    if (!meeting) {
        return HttpResponse.json({ message: "모임이 존재하지 않습니다." }, { status: 404 });
    }

    const participants = mockParticipants[mid] || [];

    // 명세서 상의 Response Body는 배열 자체임
    return HttpResponse.json(participants, { status: 200 });
});

export const participationHandlers = [
    getParticipants,
];