import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Crown, Pencil } from "lucide-react";

const Profile = () => {
    // TODO: Connect to real data
    const stats = {
        participationCount: 5 // Example count
    };

    const interests = ["운동", "자기계발", "친목"];

    return (
        <div className="w-full h-full p-10 bg-white overflow-y-auto">
            {/* Top Stats Header */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-yellow-400">프로모이머</h1>
                    <Crown className="w-8 h-8 text-yellow-600 fill-yellow-600" />
                </div>

                <h2 className="text-xl font-medium text-gray-900 mb-6">
                    지금까지 {stats.participationCount}번의 모임에 참여하셨네요!
                </h2>

                <button className="text-gray-900 font-medium hover:underline flex items-center gap-1">
                    어떤 만남이 있었을까요? &gt;
                </button>
            </div>

            <Separator className="bg-gray-200 mb-12" />

            {/* Profile Section */}
            <div className="space-y-12 ">
                {/* Basic Profile Edit Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">프로필</h3>
                    <Button variant="outline" className="border-yellow-400 text-gray-900 hover:bg-yellow-50">
                        <Pencil className="w-4 h-4 mr-2 text-yellow-500" />
                        프로필 수정
                    </Button>
                </div>

                {/* Interests Section */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">관심사</h4>
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                            <Badge
                                key={interest}
                                variant="secondary"
                                className="bg-orange-200 text-orange-800 hover:bg-orange-300 px-4 py-1.5 text-sm font-normal rounded-md"
                            >
                                {interest}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Bio Section */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">자기소개</h4>
                    <div className="space-y-4">
                        <Textarea
                            placeholder="좋은 하루 보내세요!"
                            className="min-h-[120px] resize-none border-gray-200 focus-visible:ring-yellow-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
