import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import FormField from "@components/common/FormField";
import { useCreateMeetingMutation, useUpdateMeetingMutation } from "@/hooks/useMeetingMutations";
import { useMeetingQuery } from "@/hooks/useMeetingQuery";
import DateTimePicker from "@components/common/DateTimePicker";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Meeting } from "@/models/meeting.model";
import type { MyMeetingsResponse } from "@/api/me.api";
import LoadingSpinner from "@components/common/LoadingSpinner";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod 스키마 정의
const meetingSchema = z.object({
  title: z.string().min(1, "모임명을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  description: z.string().min(1, "모임 소개를 입력해주세요").max(4000, "4000자 이내로 입력해주세요"),
  interestId: z.number().optional(),
  maxParticipants: z.number(),
  meetingDate: z.date().optional(),
  meetingHour: z.string(),
  meetingMinute: z.string(),
  meetingPeriod: z.enum(["AM", "PM"]),
  address: z.string().min(1, "모임 장소를 입력해주세요"),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting | MyMeetingsResponse;
}

function CreateMeetingModal({ open, onOpenChange, meeting }: CreateMeetingModalProps) {
  const { data: interests } = useInterestQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: meetingDetail, isLoading: isMeetingLoading } = useMeetingQuery(
    open && meeting ? (meeting as any).id || (meeting as any).meetingId : undefined
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      interestId: undefined,
      maxParticipants: 15,
      meetingDate: undefined,
      meetingHour: "3",
      meetingMinute: "00",
      meetingPeriod: "PM",
      address: "",
    }
  });

  const createMeetingMutation = useCreateMeetingMutation();
  const updateMeetingMutation = useUpdateMeetingMutation();

  // 폼 데이터 감시
  const selectedInterestId = watch("interestId");
  const maxParticipants = watch("maxParticipants");
  const meetingDate = watch("meetingDate");
  const meetingHour = watch("meetingHour");
  const meetingMinute = watch("meetingMinute");
  const meetingPeriod = watch("meetingPeriod");

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (open) {
      if (meeting && meetingDetail) {
        reset({
          title: meetingDetail.title,
          description: meetingDetail.description || "",
          interestId: interests?.find(c => c.name === meetingDetail.interestName)?.id,
          maxParticipants: meetingDetail.maxParticipants,
          meetingDate: meetingDetail.meetingDate ? new Date(meetingDetail.meetingDate) : undefined,
          meetingHour: "12",
          meetingMinute: "00",
          meetingPeriod: "PM",
          address: meetingDetail.location.address,
        });
        setPreviewImage(meetingDetail.meetingImage || null);
      } else if (!meeting) {
        // 새 모임 생성 
        reset({
          title: "",
          description: "",
          interestId: undefined,
          maxParticipants: 15,
          meetingDate: undefined,
          meetingHour: "12",
          meetingMinute: "00",
          meetingPeriod: "PM",
          address: "",
        });
        setPreviewImage(null);
      }
    }
  }, [open, meeting, meetingDetail, interests, reset]);

  // 이미지 변경
  const MAX_IMAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("지원하는 이미지 형식만 업로드할 수 있어요 (JPG, PNG, WebP, GIF)");
      e.target.value = "";
      return;
    }

    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(file.name);
    if (hasKorean) {
      alert("이미지 파일명이 한글인 경우에는 업로드할 수 없어요. 영문으로 변경해주세요");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("이미지는 4.5MB 이하만 업로드할 수 있어요");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  // 관심사 토글
  const toggleInterest = (interestId: number) => {
    setValue(
      "interestId",
      selectedInterestId === interestId ? undefined : interestId,
      { shouldValidate: true }
    );
  };

  // 폼 제출
  const onSubmit = async (data: MeetingFormValues) => {
    const confirmed = window.confirm(
      meeting ?
        "모임을 수정하시겠습니까?"
        :
        "모임을 생성하시겠습니까?\n신청 내용은 마이페이지에서 언제든지 수정 가능합니다."
    );

    if (!confirmed) {
      return;
    }

    try {
      // 이미지 업로드
      let meetingImage: string | undefined;
      if (fileInputRef.current?.files?.[0]) {
        const { uploadImage } = await import("@/api/meeting.api");
        meetingImage = await uploadImage(fileInputRef.current.files[0]);
      } else if (previewImage && meeting) {
        meetingImage = previewImage; // 기존 이미지 유지
      }

      // 날짜와 시간 결합
      const combinedDateTime = new Date(data.meetingDate!);
      let hour24 = parseInt(data.meetingHour);
      if (data.meetingPeriod === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (data.meetingPeriod === "AM" && hour24 === 12) {
        hour24 = 0;
      }
      combinedDateTime.setHours(hour24);
      combinedDateTime.setMinutes(parseInt(data.meetingMinute));

      // 모임 생성/수정
      const meetingData = {
        title: data.title,
        description: data.description,
        interestId: data.interestId!,
        maxParticipants: data.maxParticipants,
        meetingDate: combinedDateTime.toISOString(),
        address: data.address,
        meetingImage,
      };

      if (meeting) {
        await updateMeetingMutation.mutateAsync({
          id: (meeting as any).id || (meeting as any).meetingId,
          data: meetingData
        });
        alert("모임이 수정되었습니다!");
      } else {
        await createMeetingMutation.mutateAsync(meetingData);
        alert("모임이 생성되었습니다!");
      }

      // 모달 닫기
      onOpenChange(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "모임 생성에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-card flex flex-col p-0">
        <DialogHeader className="sticky top-0 bg-card z-10 px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {meeting ? "모임 정보 수정하기" : "모이머 신청하기"}
            </DialogTitle>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">닫기</span>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-6 pb-6 scrollbar-hide">
          {isMeetingLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
              {/* 모임명 */}
              <FormField label="모임명" htmlFor="title">
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="표현하고 싶은 모임명을 입력하세요! (100자 이내)"
                  className="h-12"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
              </FormField>

              {/* 모임 소개글 */}
              <FormField label="모임 소개글" htmlFor="description">
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="모임에 대해 자유롭게 설명해주세요! (4000자 이내)&#10;ex) 모임의 개성적인 특징, 모임의 의의, 참여자가 가지면 좋은 마인드, 지켜야 할 사항"
                  className="min-h-[120px] resize-none"
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
              </FormField>

              {/* 관심사 선택 */}
              <FormField
                label="관심사"
                description="모임과 관련된 관심사를 선택해주세요"
              >
                <div className="flex flex-wrap gap-2">
                  {interests?.map((interest) => (
                    <Badge
                      key={interest.id}
                      variant={selectedInterestId === interest.id ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors px-4 py-2 text-sm",
                        selectedInterestId === interest.id
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-secondary"
                      )}
                      onClick={() => toggleInterest(interest.id)}
                    >
                      {interest.name}
                      {selectedInterestId === interest.id && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
                {errors.interestId && <p className="text-xs text-red-500 mt-1">{errors.interestId.message}</p>}
              </FormField>

              {/* 모임 대표 사진 */}
              <FormField label="모임 대표 사진" description="모임을 대표할 사진을 선택해주세요 (4.5MB 이하 영문 파일명만 가능)">
                <div className="flex items-center gap-4">


                  {/* 업로드 버튼 */}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {previewImage ? "이미지 변경" : "이미지 찾기"}
                  </Button>
                  {/* 이미지 미리보기 (ProfileModal 스타일) */}
                  {previewImage && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </FormField>

              {/* 모임 날짜 및 시간 */}
              <FormField label="모임 날짜 및 시간" description="모임이 진행될 날짜와 시간을 선택해주세요">
                <DateTimePicker
                  date={meetingDate}
                  hour={meetingHour}
                  minute={meetingMinute}
                  period={meetingPeriod}
                  onDateChange={(date) => setValue("meetingDate", date, { shouldValidate: true })}
                  onHourChange={(hour) => setValue("meetingHour", hour)}
                  onMinuteChange={(minute) => setValue("meetingMinute", minute)}
                  onPeriodChange={(period) => setValue("meetingPeriod", period)}
                />
                {errors.meetingDate && <p className="text-xs text-red-500 mt-1">{errors.meetingDate.message}</p>}
              </FormField>

              {/* 모임 장소 */}
              <FormField label="모임 장소" htmlFor="address">
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="초행길인 사람도 이해하기 쉽도록 장소를 가능한 상세하게 설명해주세요."
                  className="h-12"
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
              </FormField>

              {/* 최대 인원수 */}
              <FormField
                label="최대 인원수"
                description="수용할 수 있는 인원수 만큼만 받는게 중요해요!"
              >
                <div className="space-y-4">
                  <Slider
                    value={[maxParticipants]}
                    onValueChange={(value) => setValue("maxParticipants", value[0], { shouldValidate: true })}
                    max={50}
                    min={2}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-lg font-semibold text-foreground">
                    {maxParticipants}명
                  </p>
                </div>
                {errors.maxParticipants && <p className="text-xs text-red-500 mt-1">{errors.maxParticipants.message}</p>}
              </FormField>

              {/* 승인 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-12"
                  disabled={createMeetingMutation.isPending || updateMeetingMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!isValid || createMeetingMutation.isPending || updateMeetingMutation.isPending}
                >
                  {meeting ?
                    (updateMeetingMutation.isPending ? "수정 중..." : "수정하기") :
                    (createMeetingMutation.isPending ? "신청 중..." : "신청하기")
                  }
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateMeetingModal;
