import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import { useUserUpdateMutation } from "@/hooks/useUserInfoMutations";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { UserInfo } from "@/models/user.model";

const profileSchema = z.object({
    bio: z.string().max(100, "자기소개는 100자 이내로 입력해주세요."),
    interests: z.array(z.number()).min(3, "관심사를 3개 이상 선택해주세요!"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userInfo?: UserInfo;
}

const ProfileModal = ({ isOpen, onClose, userInfo }: ProfileModalProps) => {
    const { data: currentUser } = useAuthQuery();
    const { data: allInterests } = useInterestQuery();
    const userUpdateMutation = useUserUpdateMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // userInfo.id (User) 또는 userInfo.userId (Participant) 대응
    const targetUserId = userInfo?.id || (userInfo as any)?.userId;
    const isReadOnly = targetUserId !== undefined && currentUser?.id !== undefined && targetUserId !== currentUser.id;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid }
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            bio: "",
            interests: [],
        }
    });

    useEffect(() => {
        if (userInfo) {
            reset({
                bio: userInfo.bio || "",
                interests: userInfo.interests?.map(i => i.id) || [],
            });
            const img = userInfo.profile_image || (userInfo as any).profileImage || null;
            setPreviewImage(img);
        }
    }, [userInfo, reset, isOpen]);

    const selectedInterests = watch("interests");

    const toggleInterest = (interestId: number) => {
        const currentInterests = [...selectedInterests];
        const index = currentInterests.indexOf(interestId);

        if (index > -1) {
            currentInterests.splice(index, 1);
        } else {
            currentInterests.push(interestId);
        }

        setValue("interests", currentInterests, { shouldValidate: true });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const formData = new FormData();
            formData.append("bio", data.bio);
            formData.append("interests", JSON.stringify(data.interests));

            if (fileInputRef.current?.files?.[0]) {
                formData.append("file", fileInputRef.current.files[0]);
            }

            await userUpdateMutation.mutateAsync(formData);
            alert("프로필 수정이 완료되었습니다.");
            onClose();
        } catch (error) {
            console.error("Profile update failed:", error);
            alert("프로필 수정에 실패했습니다.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6 bg-white rounded-2xl">
                <DialogHeader className="mb-0">
                    <DialogTitle className="text-2xl font-bold text-center text-[#1A2B4B]">
                        {isReadOnly ? "프로필 정보" : "프로필을 수정해주세요"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            {!isReadOnly && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <Camera className="w-5 h-5 text-gray-600" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                                name="profile_image"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {userInfo?.nickname || "사용자"}
                        </h2>
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-bold text-gray-700">자기소개</Label>
                        <Textarea
                            id="bio"
                            {...register("bio")}
                            placeholder={isReadOnly ? "등록된 자기소개가 없습니다." : "본인을 소개해주세요."}
                            readOnly={isReadOnly}
                            className={cn(
                                "min-h-[100px] bg-white border-gray-200 rounded-lg resize-none focus-visible:ring-yellow-400 text-sm",
                                isReadOnly && "focus-visible:ring-0 border-gray-100"
                            )}
                        />
                        {!isReadOnly && errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
                    </div>

                    {/* Interests Section */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label className="text-sm font-bold text-gray-700">관심사</Label>
                            {!isReadOnly && <p className="text-[10px] text-gray-400 text-center block">최소 3개이상 선택해주세요!</p>}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {allInterests?.map((interest) => (
                                <button
                                    key={interest.id}
                                    type="button"
                                    onClick={() => !isReadOnly && toggleInterest(interest.id)}
                                    disabled={isReadOnly && !selectedInterests.includes(interest.id)}
                                    className={cn(
                                        "h-10 text-[11px] font-medium rounded-lg transition-all border shadow-sm",
                                        selectedInterests.includes(interest.id)
                                            ? "bg-yellow-400 border-yellow-400 text-white shadow-md"
                                            : "bg-[#FFF4D9]/50 border-transparent text-[#6B7280] hover:bg-[#FFF4D9]",
                                        isReadOnly && !selectedInterests.includes(interest.id) && "hidden"
                                    )}
                                >
                                    {interest.name}
                                </button>
                            ))}
                        </div>
                        {!isReadOnly && errors.interests && <p className="text-xs text-red-500 mt-1">{errors.interests.message}</p>}
                    </div>

                    {/* Submit Button */}
                    {!isReadOnly && (
                        <Button
                            type="submit"
                            disabled={!isValid || userUpdateMutation.isPending}
                            className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-sm disabled:bg-gray-200 disabled:text-gray-400 border-none mt-2"
                        >
                            {userUpdateMutation.isPending ? "수정 중..." : "프로필 수정하기"}
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileModal;