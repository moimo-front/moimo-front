import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

const ResetPassword = () => {
    return (
        <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-card rounded-[12px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">비밀번호 재설정</CardTitle>
                    <CardDescription className="text-center">인증코드와 새로운 비밀번호를 입력해주세요</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 p-0">
                    <div className="flex flex-col gap-6">
                        {/* 인증코드 입력 섹션 */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="authCode"
                                className="text-sm font-medium text-muted-foreground mr-auto"
                            >
                                인증코드
                            </Label>
                            <Input
                                id="authCode"
                                type="text"
                                placeholder="인증코드"
                                className="h-12 border-input focus-visible:ring-primary flex-1"
                            />
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
                                id="newPassword"
                                type="password"
                                placeholder="새로운 비밀번호"
                                className="h-12 border-input focus-visible:ring-primary flex-1"
                            />
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
                                id="newPasswordConfirm"
                                type="password"
                                placeholder="새로운 비밀번호 확인"
                                className="h-12 border-input focus-visible:ring-primary flex-1"
                            />
                        </div>

                        {/* 비밀번호 변경하기 버튼 */}
                        <Button
                            type="submit"
                            className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
                        >
                            비밀번호 변경하기
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword;