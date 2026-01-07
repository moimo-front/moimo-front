export interface Meeting {
    id: number;
    title: string;
    description: string;
    maxParticipants: number;
    meetingDate: Date;
    address: string;
    latitude: number;
    longitude: number;
    hostId: number;
    createdAt: Date;
    updatedAt?: Date;
}