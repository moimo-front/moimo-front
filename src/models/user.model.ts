export interface User {
    id: number;
    email: string;
    password?: string;
    nickname: string;
    bio?: string;
    resetCode?: string;
    refreshToken?: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface SocialAccounts {
    id: number;
    googleSubId: string;
    userId: number;
    createdAt: Date;
    updatedAt?: Date;
}