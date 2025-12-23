type Attendance = 'ATTENDANCE' | 'ABSENT';                      // 출석체크 : 참석, 결석
type ParticipationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'; // 참여상태 : 대기, 승인, 거절

export interface Participation {
    id: number;
    userId: number;
    meetingId: number;
    status: ParticipationStatus;
    checkedIn: Attendance;
    createdAt: Date;
}