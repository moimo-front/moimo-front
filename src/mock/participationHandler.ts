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

// 개별 승인 핸들러
const approveParticipation = http.put(`${httpUrl}/meetings/:meetingId/participations/:participationId/approve`, async ({ params }) => {
    await delay(1000);
    const { meetingId, participationId } = params;
    const mid = Number(meetingId);
    const pid = Number(participationId);

    const meeting = myMeetings.find(m => m.meetingId === mid);
    if (!meeting) return HttpResponse.json({ message: "모임이 존재하지 않습니다." }, { status: 404 });

    const participants = mockParticipants[mid] || [];
    const participant = participants.find(p => p.participationId === pid);

    if (participant) {
        participant.status = 'ACCEPTED';
        // 인원수 업데이트
        meeting.currentParticipants = participants.filter(p => p.status === 'ACCEPTED').length;
    }

    return new HttpResponse(null, { status: 204 });
});

// 개별 거절 핸들러
const rejectParticipation = http.put(`${httpUrl}/meetings/:meetingId/participations/:participationId/reject`, async ({ params }) => {
    await delay(1000);
    const { meetingId, participationId } = params;
    const mid = Number(meetingId);
    const pid = Number(participationId);

    const meeting = myMeetings.find(m => m.meetingId === mid);
    if (!meeting) return HttpResponse.json({ message: "모임이 존재하지 않습니다." }, { status: 404 });

    const participants = mockParticipants[mid] || [];
    const participant = participants.find(p => p.participationId === pid);

    if (participant) {
        participant.status = 'REJECTED';
        // 인원수 업데이트 (ACCEPTED 상태였을 경우 대비)
        meeting.currentParticipants = participants.filter(p => p.status === 'ACCEPTED').length;
    }

    return new HttpResponse(null, { status: 204 });
});

// 전체 승인 핸들러
const approveAllParticipations = http.put(`${httpUrl}/meetings/:meetingId/participations/approve-all`, async ({ params }) => {
    await delay(1000);
    const { meetingId } = params;
    const mid = Number(meetingId);

    const meeting = myMeetings.find(m => m.meetingId === mid);
    if (!meeting) return HttpResponse.json({ message: "모임이 존재하지 않습니다." }, { status: 404 });

    const participants = mockParticipants[mid] || [];

    // PENDING 상태인 모든 참여자를 ACCEPTED로 변경
    participants.forEach(p => {
        if (p.status === 'PENDING') {
            p.status = 'ACCEPTED';
        }
    });

    // 인원수 업데이트
    meeting.currentParticipants = participants.filter(p => p.status === 'ACCEPTED').length;

    return new HttpResponse(null, { status: 204 });
});

// 승인 취소 핸들러
const cancelParticipation = http.put(`${httpUrl}/meetings/:meetingId/participations/:participationId/cancel`, async ({ params }) => {
    await delay(1000);
    const { meetingId, participationId } = params;
    const mid = Number(meetingId);
    const pid = Number(participationId);

    const meeting = myMeetings.find(m => m.meetingId === mid);
    if (!meeting) return HttpResponse.json({ message: "모임이 존재하지 않습니다." }, { status: 404 });

    const participants = mockParticipants[mid] || [];
    const participant = participants.find(p => p.participationId === pid);

    if (participant) {
        // 이미 승인된 참여자만 취소 가능 (PENDING으로 되돌림)
        if (participant.status === 'ACCEPTED') {
            participant.status = 'PENDING';
            // 인원수 업데이트
            meeting.currentParticipants = participants.filter(p => p.status === 'ACCEPTED').length;
        } else {
            return HttpResponse.json({ message: "이미 PENDING 상태이거나 REJECTED인 경우 취소할 수 없습니다." }, { status: 400 });
        }
    }

    return new HttpResponse(null, { status: 204 });
});

export const participationHandlers = [
    getParticipants,
    approveParticipation,
    rejectParticipation,
    approveAllParticipations,
    cancelParticipation,
];