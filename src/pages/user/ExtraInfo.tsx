import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { INTEREST_CATEGORIES } from "@/constants/interests";
import { cn } from "@/lib/utils";

const ExtraInfo = () => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const navigate = useNavigate();

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, interest];
        });
    };

    const isSelected = (interest: string) => selectedInterests.includes(interest);

    return (
        <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-[500px] p-8 shadow-lg border-none bg-card rounded-[12px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">프로필 등록하기</CardTitle>
                    <CardDescription className="text-center">프로필을 등록하여 모이모와 함께해요</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 p-0">
                    <div className="flex flex-col gap-6">
                        {/* 자기소개 입력 섹션 */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="bio"
                                className="text-sm font-medium text-muted-foreground mr-auto"
                            >
                                자기소개
                            </Label>
                            <Textarea
                                id="bio"
                                placeholder="자기소개를 입력해주세요"
                                className="h-12 border-input focus-visible:ring-primary"
                            />
                        </div>
                        {/* 관심사 선택 섹션 */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="interests"
                                className="text-sm font-medium text-muted-foreground mr-auto"
                            >
                                관심사 (최대 3개까지 선택해주세요)
                            </Label>
                            <div className="grid grid-cols-4 gap-3">
                                {INTEREST_CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => toggleInterest(category)}
                                        className={cn(
                                            "h-12 rounded-[8px] text-sm font-medium transition-all duration-200 border-none shadow-sm",
                                            isSelected(category)
                                                ? "bg-primary text-white shadow-md transform scale-[0.98]"
                                                : "bg-secondary/40 text-foreground hover:bg-secondary/60"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 등록 버튼 */}
                        <div className="flex flex-col gap-4 mt-2">
                            <Button
                                disabled={selectedInterests.length === 0}
                                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none disabled:bg-muted disabled:text-muted-foreground"
                            >
                                프로필 등록하기
                            </Button>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                            >
                                다음에 할래요
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ExtraInfo;