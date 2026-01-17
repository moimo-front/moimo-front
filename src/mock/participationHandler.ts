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

// 모임 참여자 상태 일괄 업데이트 핸들러
const updateParticipation = http.put(`${httpUrl}/meetings/:meetingId/participations`, async ({ params, request }) => {
    await delay(1000);

    const { meetingId } = params;
    const mid = Number(meetingId);

    // Body 데이터: { participationId: number, status: ParticipationStatus }[]
    const updates = await request.json() as { participationId: number, status: string }[];

    const meeting = myMeetings.find(m => m.meetingId === mid);
    if (!meeting) {
        return HttpResponse.json({ message: "모임이 존재하지 않습니다." }, { status: 404 });
    }

    const participants = mockParticipants[mid] || [];

    updates.forEach(update => {
        const participant = participants.find(p => p.participationId === update.participationId);
        if (participant) {
            participant.status = update.status as any;
        }
    });

    // ACCEPTED 상태인 참여자 수를 계산하여 meeting.currentParticipants 업데이트
    const acceptedCount = participants.filter(p => p.status === 'ACCEPTED').length;
    meeting.currentParticipants = acceptedCount;

    return HttpResponse.json({ message: "참여자 상태가 업데이트되었습니다." }, { status: 200 });
});

export const participationHandlers = [
    getParticipants,
    updateParticipation,
];