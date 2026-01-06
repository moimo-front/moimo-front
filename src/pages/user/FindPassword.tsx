import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Link } from "react-router-dom";

const FindPassword = () => {
    return (
        <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-card rounded-[12px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">비밀번호 찾기</CardTitle>
                    <CardDescription className="text-center">가입한 이메일을 입력해주세요</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 p-0">
                    <div className="flex flex-col gap-6">
                        {/* 이메일 입력 섹션 */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-muted-foreground mr-auto"
                            >
                                이메일
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="moimo@email.com"
                                className="h-12 border-input focus-visible:ring-primary flex-1"
                            />
                        </div>
                        {/* 인증코드 전송 버튼 */}
                        <Button
                            asChild
                            className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
                        >
                            <Link to="/reset-password">
                                인증코드 전송
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default FindPassword;