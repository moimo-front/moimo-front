import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const INTEREST_CATEGORIES = [
    "기획/PM", "디자인", "프론트엔드", "백엔드",
    "데이터 분석", "AI/ML", "데브옵스", "인프라",
    "마케팅", "창업", "운동", "독서"
];

const SelectInterests = () => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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
            <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-card rounded-[12px]">
                <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-2xl font-bold text-center text-foreground whitespace-pre-line leading-tight">
                        {"마지막 단계입니다.\n당신의 관심사를 알려주세요"}
                    </CardTitle>
                    <CardDescription className="text-center mt-4 text-muted-foreground">
                        최대 3개까지 선택해주세요!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 p-0">
                    <div className="grid grid-cols-2 gap-3">
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

                    <div className="flex flex-col gap-4 mt-2">
                        <Button
                            disabled={selectedInterests.length === 0}
                            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none disabled:bg-muted disabled:text-muted-foreground"
                        >
                            선택 완료
                        </Button>
                        <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                        >
                            다음에 할래요
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SelectInterests;
