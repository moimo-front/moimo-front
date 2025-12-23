export interface Interest {
    id: number;
    name: string;
}

export interface UserInterest {
    id: number;
    userId: number;
    interestId: number;
}