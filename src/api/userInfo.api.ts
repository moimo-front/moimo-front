import type { ExtraInfoFormValues } from "@/pages/user/ExtraInfo"
import { apiClient } from "./client"

export interface ExtraInfoPayload extends ExtraInfoFormValues {
    // id: number;
    // email: string;
    nickname: string;
}

export const extraInfo = async (data: ExtraInfoPayload) => {
    try {
        return apiClient.put("/users/extra-info", data)
    } catch (error) {
        console.error("extraInfo error:", error)
        throw error
    }
}