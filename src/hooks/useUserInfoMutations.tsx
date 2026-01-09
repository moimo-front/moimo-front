import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { extraInfo, type ExtraInfoPayload } from "@/api/userInfo.api";

export const useExtraInfoMutation = () => {
    return useMutation({
        mutationFn: async (data: ExtraInfoPayload) => {
            return await extraInfo(data);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}