import { apiClient } from "./client"
import { verifyUser } from "./auth.api";

/**
 * @deprecated verifyUser를 사용하세요. users/verify 엔드포인트가 모든 사용자 정보를 반환합니다.
 */
export const getUserInfo = async () => {
    // users/verify로 통합되었으므로 verifyUser 호출
    return verifyUser();
}

// 프로필 등록/수정
export const userInfoUpdate = async (data: FormData) => {
    try {
        return apiClient.put("/users/user-update", data);
    } catch (error) {
        console.error("userInfoUpdate error:", error);
        throw error;
    }
}