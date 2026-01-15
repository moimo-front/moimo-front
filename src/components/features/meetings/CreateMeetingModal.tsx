import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import FormField from "@components/common/FormField";
import DateTimePicker from "@components/common/DateTimePicker";
import { useCreateMeetingMutation } from "@/hooks/useMeetingMutations";
import { TOPIC_CATEGORIES } from "@/constants/topics";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateMeetingModal({ open, onOpenChange }: CreateMeetingModalProps) {
  const [meetingName, setMeetingName] = useState("");
  const [meetingIntro, setMeetingIntro] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date>();
  const [meetingHour, setMeetingHour] = useState("3");
  const [meetingMinute, setMeetingMinute] = useState("00");
  const [meetingPeriod, setMeetingPeriod] = useState<"AM" | "PM">("PM");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState([15]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<number | null>(null);

  const createMeetingMutation = useCreateMeetingMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const selectInterest = (interestId: number) => {
    setSelectedInterest(interestId === selectedInterest ? null : interestId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingDate) {
      alert("모임 날짜를 선택해주세요.");
      return;
    }

    if (!selectedInterest) {
      alert("관심사를 선택해주세요.");
      return;
    }

    const confirmed = window.confirm(
      "모임을 생성하시겠습니까?\n\n신청 내용은 마이페이지에서 언제든지 수정 가능합니다."
    );
    
    if (!confirmed) {
      return; 
    }

    try {
      // 1단계: 이미지가 있으면 먼저 업로드 (프론트에서 이미지 업로드한다고 가정)
      let imageUrl: string | undefined;
      if (selectedImage) {
        const { uploadImage } = await import("@/api/meeting.api");
        imageUrl = await uploadImage(selectedImage);
      }

      // 2단계: 날짜와 시간 결합 (Date 객체를 위해 12시간 형식을 24시간으로 변환)
      const combinedDateTime = new Date(meetingDate);
      let hour24 = parseInt(meetingHour);
      if (meetingPeriod === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (meetingPeriod === "AM" && hour24 === 12) {
        hour24 = 0;
      }
      combinedDateTime.setHours(hour24);
      combinedDateTime.setMinutes(parseInt(meetingMinute));

      // 3단계: 모임 생성 (이미지 URL 포함)
      await createMeetingMutation.mutateAsync({
        title: meetingName,
        description: meetingIntro,
        interestIds: [selectedInterest], 
        maxParticipants: maxParticipants[0],
        meetingDate: combinedDateTime.toISOString(),
        address: location,
        imageUrl, // 클라우드 URL
      });

      alert("모임이 생성되었습니다!");
      
      // 폼 초기화
      setMeetingName("");
      setMeetingIntro("");
      setMeetingDate(undefined);
      setMeetingHour("3");
      setMeetingMinute("00");
      setMeetingPeriod("PM");
      setLocation("");
      setMaxParticipants([15]);
      setSelectedImage(null);
      setSelectedInterest(null);
      
      // 모달 닫기
      onOpenChange(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "모임 생성에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-card flex flex-col p-0">
        <DialogHeader className="sticky top-0 bg-card pb-4 pt-6 px-6 border-b border-border">
          <DialogTitle className="text-2xl font-bold">모이머 신청하기</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 scrollbar-hide">
          <form onSubmit={handleSubmit} className="space-y-6 mt-4 pb-6">
          {/* 모임명 */}
          <FormField label="모임명" htmlFor="meetingName">
            <Input
              id="meetingName"
              placeholder="표현하고 싶은 모임명을 입력하세요!(100자 이내)"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              maxLength={100}
              className="h-12"
              required
            />
          </FormField>

          {/* 모임 소개글 */}
          <FormField label="모임 소개글" htmlFor="meetingIntro">
            <Textarea
              id="meetingIntro"
              placeholder="모임에 대해 자유롭게 설명해주세요!(4000자 이내)&#10;ex) 모임의 개성적인 특징, 모임의 의의, 참여자가 가지면 좋은 마인드, 지켜야 할 사항"
              value={meetingIntro}
              onChange={(e) => setMeetingIntro(e.target.value)}
              maxLength={4000}
              className="min-h-[120px] resize-none"
              required
            />
          </FormField>

            {/* 관심사 선택 */}
            <FormField 
              label="관심사" 
              description="모임과 관련된 관심사를 하나 선택해주세요"
            >
              <div className="flex flex-wrap gap-2">
                {TOPIC_CATEGORIES.map((interest) => (
                  <Badge
                    key={interest.id}
                    variant={selectedInterest === interest.id ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors px-4 py-2 text-sm",
                      selectedInterest === interest.id
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-secondary"
                    )}
                    onClick={() => selectInterest(interest.id)}
                  >
                    {interest.name}
                    {selectedInterest === interest.id && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </FormField>

          {/* 모임 대표 사진 */}
          <FormField label="모임 대표 사진" htmlFor="meetingImage" description="모임과 관련된 사진을 선택해주세요">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                onClick={() => document.getElementById('meetingImage')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                이미지 찾기
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedImage ? selectedImage.name : "선택된 파일 없음"}
              </span>
              <input
                id="meetingImage"
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
              onDateChange={setMeetingDate}
              onHourChange={setMeetingHour}
              onMinuteChange={setMeetingMinute}
              onPeriodChange={setMeetingPeriod}
            />
          </FormField>

          {/* 모임 장소 (카카오 API로 리펙토링할 예정) */}
          <FormField label="모임 장소 (카카오 API로 리팩토링예정)" htmlFor="location">
            <Input
              id="location"
              placeholder="초행길인 사람도 이해하기 쉽도록 장소를 가능한 상세하게 설명해주세요."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
              required
            />
          </FormField>

          {/* 최대 인원수 */}
          <FormField 
            label="최대 인원수" 
            description="수용할 수 있는 인원수 만큼만 받는게 중요해요!"
          >
            <div className="space-y-4">
              <Slider
                value={maxParticipants}
                onValueChange={setMaxParticipants}
                max={50}
                min={2}
                step={1}
                className="w-full"
              />
              <p className="text-lg font-semibold text-foreground">
                {maxParticipants[0]}명
              </p>
            </div>
          </FormField>

          {/* 승인 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
              disabled={createMeetingMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={createMeetingMutation.isPending}
            >
              {createMeetingMutation.isPending ? "신청 중..." : "신청하기"}
            </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateMeetingModal;
