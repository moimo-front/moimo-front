import { useQuery } from "@tanstack/react-query";
import { verifyUser } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";

export const useAuthQuery = () => {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const { accessToken: currentToken, storeLogin, storeLogout, isLoggedIn } = useAuthStore.getState();
            try {
                const verifyUserInfo = await verifyUser();
                if (verifyUserInfo.authenticated) {
                    // 새 토큰이 있으면 새 토큰 사용, 없으면 기존 토큰 유지
                    const tokenToStore = verifyUserInfo.accessToken || currentToken;
                    storeLogin(verifyUserInfo.user.nickname, tokenToStore!);
                    return verifyUserInfo;
                }

                // 인증 실패 시 로그인 상태였으면 로그아웃 처리
                if (isLoggedIn) {
                    storeLogout();
                }
                return null;
            } catch (error) {
                if (isLoggedIn) {
                    storeLogout();
                }
                return null;
            }
        },
        // 사용자가 앱을 사용하는 동안 인증 상태를 유지하기 위해 staleTime 설정
        staleTime: 1000 * 60 * 30, // 30분
        retry: false, // 인증 실패 시 반복 요청 방지
    });
};
