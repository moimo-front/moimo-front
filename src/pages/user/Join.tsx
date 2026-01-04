import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Join = () => {
    return (
        <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-card rounded-[12px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">모이모 가입하기</CardTitle>
                    <CardDescription className="text-center">새로운 계정을 만들어 모이모와 함께해요</CardDescription>
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
                            <div className="flex gap-2">
                                <Input
                                    id="email"
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
                                id="password"
                                type="password"
                                placeholder="8자 이상 입력"
                                className="h-12 border-input focus-visible:ring-primary"
                            />
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
                                id="passwordConfirm"
                                type="password"
                                placeholder="8자 이상 입력"
                                className="h-12 border-input focus-visible:ring-primary"
                            />
                        </div>
                        {/* 등록 버튼 */}
                        <Button
                            asChild
                            className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
                        >
                            <Link to="/extra-info">
                                프로필 등록하기
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Join;