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
    googleLogin
} from "@/api/auth.api";
import { AxiosError } from "axios";
import type { JoinFormValues } from "@/pages/user/Join";

// 로그인 Mutation
export const useLoginMutation = () => {
    const { storeLogin } = useAuthStore();

    return useMutation({
        mutationFn: async (data: LoginFormValues) => {
            const resData = await login(data);
            return resData;
        },
        onSuccess: (data) => {
            // 로그인 성공 시 전역 상태 업데이트
            storeLogin(data.user.nickname);
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
            const resData = await join(data);
            return resData;
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
            const resData = await checkEmail({ email });
            return resData;
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
            const resData = await checkNickname({ nickname });
            return resData;
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
            const resData = await findPassword(data);
            return resData;
        }
    })
}

// 비밀번호 재설정 Mutation
export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const resData = await resetPassword(data);
            return resData;
        }
    })
}

// 구글 로그인 Mutation
export const useGoogleLoginMutation = () => {
    const { storeLogin } = useAuthStore();
    return useMutation({
        mutationFn: async (data: { token: string; redirectUri: string }) => {
            const resData = await googleLogin(data);
            return resData;
        },
        onSuccess: (data) => {
            storeLogin(data.user.nickname);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}
