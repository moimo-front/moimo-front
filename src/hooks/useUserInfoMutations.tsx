import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { userInfoUpdate } from "@/api/userInfo.api";


export const useUserUpdateMutation = () => {
    return useMutation({
        mutationFn: async (data: FormData) => {
            return await userInfoUpdate(data);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.error(error);
        }
    })
}