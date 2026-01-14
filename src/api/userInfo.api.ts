import { apiClient } from "./client"

export const userInfoUpdate = async (data: FormData) => {
    try {
        return apiClient.put("/users/user-update", data);
    } catch (error) {
        console.error("userInfoUpdate error:", error);
        throw error;
    }
}