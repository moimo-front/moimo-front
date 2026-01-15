import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import FormField from "@components/common/FormField";
import { useCreateMeetingMutation } from "@/hooks/useMeetingMutations";
import { useMeetingQuery } from "@/hooks/useMeetingQuery";
import { TOPIC_CATEGORIES } from "@/constants/topics";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Meeting } from "@/models/meeting.model";
import type { MyMeetingsResponse } from "@/api/me.api";
import LoadingSpinner from "@components/common/LoadingSpinner"; // Ensure this exists or use text

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting | MyMeetingsResponse;
}

function CreateMeetingModal({ open, onOpenChange, meeting }: CreateMeetingModalProps) {
  const [meetingName, setMeetingName] = useState("");
  const [meetingIntro, setMeetingIntro] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState([15]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: meetingDetail, isLoading: isMeetingLoading } = useMeetingQuery(
    open && meeting ? (meeting as any).id || (meeting as any).meetingId : undefined
  );

  useEffect(() => {
    if (open) {
      if (meeting && meetingDetail) {
        setMeetingName(meetingDetail.title);
        setMeetingIntro(meetingDetail.description || "");
        setMeetingDate(meetingDetail.meetingDate ? new Date(meetingDetail.meetingDate) : undefined);
        setLocation(meetingDetail.address);
        setMaxParticipants([meetingDetail.maxParticipants]);
        // Cast to any because MeetingDetail might not officially have interestIds/imageUrl yet (pending backend update)
        // But our mock returns them.
        setSelectedInterests((meetingDetail as any).interestIds || []);
        setPreviewUrl((meetingDetail as any).imageUrl || null);
        setSelectedImage(null);
      } else if (!meeting) {
        // Reset for new meeting
        setMeetingName("");
        setMeetingIntro("");
        setMeetingDate(undefined);
        setLocation("");
        setMaxParticipants([15]);
        setSelectedImage(null);
        setSelectedInterests([]);
        setPreviewUrl(null);
      }
    }
  }, [open, meeting, meetingDetail]);

  const createMeetingMutation = useCreateMeetingMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const toggleInterest = (interestId: number) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingDate) {
      alert("모임 날짜를 선택해주세요.");
      return;
    }

    if (selectedInterests.length === 0) {
      alert("관심사를 최소 1개 이상 선택해주세요.");
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

      // 2단계: 모임 생성 (이미지 URL 포함)
      await createMeetingMutation.mutateAsync({
        title: meetingName,
        description: meetingIntro,
        interestIds: selectedInterests,
        maxParticipants: maxParticipants[0],
        meetingDate: meetingDate.toISOString(),
        address: location,
        imageUrl, // 클라우드 URL
      });

      alert("모임이 생성되었습니다!");

      // 폼 초기화
      setMeetingName("");
      setMeetingIntro("");
      setMeetingDate(undefined);
      setLocation("");
      setMaxParticipants([15]);
      setSelectedImage(null);
      setSelectedInterests([]);

      // 모달 닫기
      onOpenChange(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "모임 생성에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {meeting ? "모임 정보 수정" : "모이머 신청하기"}
          </DialogTitle>
        </DialogHeader>

        {isMeetingLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* 모임명 */}
            <FormField label="모임명" htmlFor="meetingName">
              <Input
                id="meetingName"
                placeholder="표현하고 싶은 모임명을 입력하세요!"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className="h-12"
                required
              />
            </FormField>

            {/* 모임 소개글 */}
            <FormField label="모임 소개글" htmlFor="meetingIntro">
              <Textarea
                id="meetingIntro"
                placeholder="모임에 대해 자유롭게 설명해주세요!&#10;ex) 모임의 개성적인 특징, 모임의 의의, 참여자가 가지면 좋은 마인드, 지켜야 할 사항"
                value={meetingIntro}
                onChange={(e) => setMeetingIntro(e.target.value)}
                className="min-h-[120px] resize-none"
                required
              />
            </FormField>

            {/* 관심사 선택 */}
            <FormField
              label="관심사"
              description="모임과 관련된 관심사를 선택해주세요 (최소 1개)"
            >
              <div className="flex flex-wrap gap-2">
                {TOPIC_CATEGORIES.map((interest) => (
                  <Badge
                    key={interest.id}
                    variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors px-4 py-2 text-sm",
                      selectedInterests.includes(interest.id)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-secondary"
                    )}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    {interest.name}
                    {selectedInterests.includes(interest.id) && (
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
                  {selectedImage ? selectedImage.name : (previewUrl ? "기존 이미지 유지" : "선택된 파일 없음")}
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
              <div className="space-y-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal ",
                        !meetingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {meetingDate ? (
                        format(meetingDate, "PPP", { locale: ko })
                      ) : (
                        <span>날짜를 선택하세요</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-35 p-0 " align="start">
                    <Calendar
                      mode="single"
                      selected={meetingDate}
                      onSelect={setMeetingDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {/* 시간 선택 기능 추가예정 */}
              </div>
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
                {meeting ?
                  (createMeetingMutation.isPending ? "수정 중..." : "수정하기") :
                  (createMeetingMutation.isPending ? "신청 중..." : "신청하기")
                }
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateMeetingModal;
