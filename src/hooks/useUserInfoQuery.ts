import { useQuery } from "@tanstack/react-query";
import { verifyUser } from "@/api/auth.api";

/**
 * @deprecated useAuthQuery를 사용하세요. 이 훅은 하위 호환성을 위해 유지됩니다.
 * useUserInfoQuery는 내부적으로 useAuthQuery와 동일한 쿼리 캐시를 공유합니다.
 */
export const useUserInfoQuery = () => {
    return useQuery({
        queryKey: ["authUser"],  // useAuthQuery와 동일한 쿼리 키 사용
        queryFn: async () => {
            const verifyUserInfo = await verifyUser();
            return verifyUserInfo;
        },
        staleTime: 1000 * 60 * 30, // 30분
        retry: false,
    });
}