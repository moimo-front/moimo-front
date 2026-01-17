import type { Interest } from "./interest.model";

export interface User {
    id: number;
    email: string;
    nickname: string;
    bio?: string | null;
    resetToken?: string;
    refreshToken?: string;
    profile_image?: string | null;  // image에서 profile_image로 통일
    createdAt: Date;
    updatedAt?: Date;
}

export type UserInfo = Partial<User> & {
    interests: Interest[];
}

export interface SocialAccounts {
    id: number;
    googleSubId: string;
    userId: number;
    createdAt: Date;
    updatedAt?: Date;
}