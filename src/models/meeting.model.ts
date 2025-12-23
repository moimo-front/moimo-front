export interface Meeting {
    id: number;
    title: string;
    description: string;
    interestId: number;
    maxParticipants: number;
    meetingDate: Date;
    address: string;
    latitude: number;
    longitude: number;
    hostId: number;
    createdAt: Date;
}