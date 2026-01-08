import type { LoginFormValues } from "@/pages/user/Login";
import { apiClient } from "@/api/client";
import type { JoinFormValues } from "@/pages/user/Join";

export interface LoginResponse {
    user: {
        email: string;
        nickname: string;
    };
    accessToken: string;
    isNewUser: boolean;
}

export const login = async (data: LoginFormValues): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post("/users/login", data);
        const accessToken = response.headers.authorization?.replace("Bearer ", "");
        return {
            ...response.data,
            accessToken,
        };
    } catch (error) {
        console.error("login error:", error);
        throw error;
    }
};

export const googleLogin = async (data: { token: string; redirectUri: string }): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post("/users/login/google", data);
        const accessToken = response.headers.authorization?.replace("Bearer ", "");
        return {
            ...response.data,
            accessToken,
        };
    } catch (error) {
        console.error("googleLogin error:", error);
        throw error;
    }
};

// 로그아웃
export const logout = async () => {
    try {
        const response = await apiClient.post(`/users/logout`);
        return response.data;
    } catch (error) {
        console.error("logout error:", error);
        throw error;
    }
}

export const join = async (data: JoinFormValues): Promise<{ message: string }> => {
    try {
        const response = await apiClient.post("/users/register", data);
        return response.data;
    } catch (error) {
        console.error("join error:", error);
        throw error;
    }
};

export const checkEmail = async (data: { email: string }) => {
    try {
        const response = await apiClient.post("/users/check-email", data);
        return response.data;
    } catch (error) {
        console.error("checkEmail error:", error);
        throw error;
    }
};

export const checkNickname = async (data: { nickname: string }) => {
    try {
        const response = await apiClient.post("/users/check-nickname", data);
        return response.data;
    } catch (error) {
        console.error("checkNickname error:", error);
        throw error;
    }
};

export const findPassword = async (data: { email: string }): Promise<{ message: string }> => {
    try {
        const response = await apiClient.post("/users/find-password", data);
        return response.data;
    } catch (error) {
        console.error("findPassword error:", error);
        throw error;
    }
};

export const resetPassword = async (data: any): Promise<{ message: string }> => {
    try {
        const response = await apiClient.post("/users/reset-password", data);
        return response.data;
    } catch (error) {
        console.error("resetPassword error:", error);
        throw error;
    }
};

// 토큰 갱신
export const refresh = async (): Promise<string | undefined> => {
    try {
        const response = await apiClient.post("/users/refresh");
        const accessToken = response.headers.authorization?.replace("Bearer ", "");
        return accessToken;
    } catch (error) {
        console.error("refresh error:", error);
        throw error;
    }
}
