import type { LoginFormValues } from "@/pages/user/Login";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import {
    login,
    join,
    checkEmail,
    checkNickname,
    findPassword,
    resetPassword,
    googleLogin,
    logout
} from "@/api/auth.api";
import { AxiosError } from "axios";
import type { JoinFormValues } from "@/pages/user/Join";

// 로그인 Mutation
export const useLoginMutation = () => {
    const { storeLogin } = useAuthStore();

    return useMutation({
        mutationFn: async (data: LoginFormValues) => {
            return await login(data);
        },
        onSuccess: (data) => {
            // 로그인 성공 시 전역 상태 업데이트
            storeLogin(data.user.nickname, data.accessToken);
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

// 구글 로그인 Mutation
export const useGoogleLoginMutation = () => {
    const { storeLogin } = useAuthStore();
    return useMutation({
        mutationFn: async (data: { code: string; redirectUri: string }) => {
            return await googleLogin(data);
        },
        onSuccess: (data) => {
            storeLogin(data.user.nickname, data.accessToken);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}

// 로그아웃 Mutation
export const useLogoutMutation = () => {
    const { storeLogout } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            return await logout();
        },
        onSuccess: () => {
            // 로그아웃 성공 시 전역 상태 업데이트
            storeLogout();
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

// 회원가입 Muatation
export const useJoinMutation = () => {
    return useMutation({
        mutationFn: async (data: JoinFormValues) => {
            return await join(data);
        },
        onSuccess: (data) => {
            const { storeLogin } = useAuthStore.getState();
            if (data.accessToken) {
                storeLogin(data.user.nickname, data.accessToken);
            }
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}

// 이메일 중복 확인 Mutation
export const useEmailCheckMutation = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            return await checkEmail({ email });
        },
        onSuccess: () => {

        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}

// 닉네임 중복 확인 Mutation
export const useNicknameCheckMutation = () => {
    return useMutation({
        mutationFn: async (nickname: string) => {
            return await checkNickname({ nickname });
        },
        onSuccess: () => {

        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}

// 비밀번호 찾기 Mutation
export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            return await findPassword(data);
        }
    })
}

// 비밀번호 재설정 Mutation
export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            return await resetPassword(data);
        }
    })
}
