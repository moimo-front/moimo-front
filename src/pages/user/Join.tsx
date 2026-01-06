import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// zod schema 정의
export const joinSchema = z
    .object({
        email: z
            .string()
            .min(1, "이메일을 입력해주세요.")
            .email("이메일 형식이 올바르지 않습니다."),
        nickname: z
            .string()
            .min(1, "닉네임을 입력해주세요."),
        password: z
            .string()
            .min(1, "비밀번호를 입력해주세요.")
            .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
        passwordConfirm: z
            .string()
            .min(1, "비밀번호를 입력해주세요.")
            .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    })
    .refine(
        (data) => data.password === data.passwordConfirm,
        {
            message: "비밀번호가 일치하지 않습니다.",
            path: ["passwordConfirm"],
        }
    );

// zod schema에서 추출한 타입
export type JoinFormValues = z.infer<typeof joinSchema>;

const Join = () => {
    // react-hook-form 사용
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<JoinFormValues>({
        resolver: zodResolver(joinSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: "",
        }
    });

    const onSubmit = (data: JoinFormValues) => {
        console.log(data);
    };

    return (
        <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-card rounded-[12px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">모이모 가입하기</CardTitle>
                    <CardDescription className="text-center">새로운 계정을 만들어 모이모와 함께해요</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 p-0">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* 이메일 입력 섹션 */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-muted-foreground mr-auto"
                                >
                                    이메일
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        {...register("email")}
                                        type="email"
                                        placeholder="moimo@email.com"
                                        className="h-12 border-input focus-visible:ring-primary flex-1"
                                    />
                                    <Button
                                        type="button"
                                        className="h-12 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-[8px] transition-colors shadow-none border-none shrink-0"
                                    >
                                        중복확인
                                    </Button>
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            {/* 닉네임 입력 섹션 */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="nickname"
                                    className="text-sm font-medium text-muted-foreground mr-auto"
                                >
                                    닉네임
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        {...register("nickname")}
                                        type="nickname"
                                        placeholder="노래하는햄스터"
                                        className="h-12 border-input focus-visible:ring-primary flex-1"
                                    />
                                    <Button
                                        type="button"
                                        className="h-12 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-[8px] transition-colors shadow-none border-none shrink-0"
                                    >
                                        중복확인
                                    </Button>
                                </div>
                                {errors.nickname && (
                                    <p className="text-sm text-destructive">
                                        {errors.nickname.message}
                                    </p>
                                )}
                            </div>
                            {/* 비밀번호 입력 섹션 */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-muted-foreground mr-auto"
                                >
                                    비밀번호
                                </Label>
                                <Input
                                    {...register("password")}
                                    type="password"
                                    placeholder="8자 이상 입력"
                                    className="h-12 border-input focus-visible:ring-primary"
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            {/* 비밀번호 확인 섹션 */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="passwordConfirm"
                                    className="text-sm font-medium text-muted-foreground mr-auto"
                                >
                                    비밀번호 확인
                                </Label>
                                <Input
                                    {...register("passwordConfirm")}
                                    type="password"
                                    placeholder="8자 이상 입력"
                                    className="h-12 border-input focus-visible:ring-primary"
                                />
                                {errors.passwordConfirm && (
                                    <p className="text-sm text-destructive">
                                        {errors.passwordConfirm.message}
                                    </p>
                                )}
                            </div>
                            {/* 회원가입 버튼 */}
                            <Button
                                type="submit"
                                className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
                            >
                                회원가입하기
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Join;