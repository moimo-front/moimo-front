type UserRole = 'USER' | 'ADMIN' | 'HEAD_ADMIN';                // 사용자구분 : 일반유저, 중간 관리자 계정, 최고 관리자 계정

export interface User {
    id: number;
    name?: string;
    email: string;
    password: string;
    nickname: string;
    bio?: string;
    provider: string;
    providerId?: string;
    role: UserRole;
    // avatarUrl?: string;
    createdAt: Date;
}