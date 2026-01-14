import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useResetPasswordMutation } from "@/hooks/useAuthMutations";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

// zod schema 정의
export const resetPasswordSchema = z
    .object({
        resetCode: z
            .string()
            .min(1, "인증코드를 입력해주세요."),
        newPassword: z
            .string()
            .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
        newPasswordConfirm: z
            .string()
            .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    })
    .refine(
        (data) => data.newPassword === data.newPasswordConfirm,
        {
            message: "비밀번호가 일치하지 않습니다.",
            path: ["newPasswordConfirm"],
        }
    );

// zod schema에서 추출한 타입
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const { mutate: resetPassword, isPending } = useResetPasswordMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = (data: ResetPasswordFormValues) => {
        resetPassword(data, {
            onSuccess: () => {
                alert("비밀번호 변경이 완료되었습니다.");
                navigate("/login");
            },
            onError: (error: AxiosError) => {
                if (error.response?.status === 400) {
                    setError("resetCode", { message: "인증코드가 유효하지 않거나 만료되었습니다." });
                    return;
                }
                setError(
                    "root",
                    {
                        type: "manual",
                        message: "비밀번호 변경에 실패했습니다.",
                    }
                );
            }
        });
    };

    return (
        <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-card rounded-[12px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">비밀번호 재설정</CardTitle>
                    <CardDescription className="text-center">인증코드와 새로운 비밀번호를 입력해주세요</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 p-0">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* 인증코드 입력 섹션 */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="resetCode"
                                    className="text-sm font-medium text-muted-foreground mr-auto"
                                >
                                    인증코드
                                </Label>
                                <Input
                                    {...register("resetCode")}
                                    type="text"
                                    placeholder="인증코드"
                                    className="h-12 border-input focus-visible:ring-primary flex-1"
                                />
                                {errors.resetCode && <p className="text-sm text-destructive">{errors.resetCode.message}</p>}
                            </div>
                            {/* 새로운 비밀번호 입력 섹션 */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="newPassword"
                                    className="text-sm font-medium text-muted-foreground mr-auto"
                                >
                                    새로운 비밀번호
                                </Label>
                                <Input
                                    {...register("newPassword")}
                                    type="password"
                                    placeholder="새로운 비밀번호"
                                    className="h-12 border-input focus-visible:ring-primary flex-1"
                                />
                                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
                            </div>
                            {/* 새로운 비밀번호 확인 입력 섹션 */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="newPasswordConfirm"
                                    className="text-sm font-medium text-muted-foreground mr-auto"
                                >
                                    새로운 비밀번호 확인
                                </Label>
                                <Input
                                    {...register("newPasswordConfirm")}
                                    type="password"
                                    placeholder="새로운 비밀번호 확인"
                                    className="h-12 border-input focus-visible:ring-primary flex-1"
                                />
                                {errors.newPasswordConfirm && <p className="text-sm text-destructive">{errors.newPasswordConfirm.message}</p>}
                            </div>

                            {/* 비밀번호 변경하기 버튼 */}
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
                            >
                                {isPending ? "변경 중..." : "비밀번호 변경하기"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword;