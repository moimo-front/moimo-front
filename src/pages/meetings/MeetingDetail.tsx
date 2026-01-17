import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import FixedBottomButton from "@/components/common/FixedBottomButton";
import { IoLocationOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { getMeetingById } from "@/api/meeting.api";
import type { MeetingDetail } from "@/models/meeting.model";
import moimoMeeting from "@/assets/images/moimo-meetings.png";
import { useAuthStore } from "@/store/authStore";
import LoginRequiredDialog from "@/components/common/LoginRequiredDialog";
import KakaoMapView from "@/components/common/kakaoMaps/KakaoMapView";
import { toast } from "sonner";

function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [meetingDetail, setMeetingDetail] = useState<MeetingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // 로그인 상태 및 모달 관리
  const { isLoggedIn } = useAuthStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchMeetingDetail = async () => {
      if (!meetingId) {
        console.log("meetingId가 없습니다");
        return;
      }

      console.log("모임 조회 시작:", meetingId);

      try {
        setIsLoading(true);
        const response = await getMeetingById(meetingId);
        console.log("API 응답:", response);
        setMeetingDetail(response); // response 자체가 MeetingDetail
        setError(null);
      } catch (err: any) {
        console.error("API 에러:", err);
        console.error("에러 응답:", err.response?.data);
        setError(err.response?.data?.message || "모임 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingDetail();
  }, [meetingId]);

  // 설명 텍스트 높이 확인
  useEffect(() => {
    if (descriptionRef.current && meetingDetail) {
      const height = descriptionRef.current.scrollHeight;
      setShowExpandButton(height > 256); // 256px = max-h-64
    }
  }, [meetingDetail]);

  const handleJoinMeeting = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    // TODO: 로그인 상태면 신청 모달 표시
    console.log("Join meeting:", meetingId);
    toast.info("신청 기능은 곳 추가될 예정입니다!");
  };

  console.log("🎯 렌더링 상태:", { isLoading, error, meetingDetail: !!meetingDetail });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error || !meetingDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">
          {error || "모임을 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}. ${month}. ${day}(${weekday}) ${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      <div className="w-full max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between pb-3">

        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 pb-4 space-y-4">
        <div className="flex gap-3">
          {/* 이미지 */}
          <div className="w-[60%] h-[40%] rounded-lg overflow-hidden bg-primary/80 flex-shrink-0">
            {meetingDetail.meetingImage ? (
              <img
                src={meetingDetail.meetingImage}
                alt={meetingDetail.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={moimoMeeting}
                alt={meetingDetail.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 flex flex-col gap-4 justify-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {meetingDetail.title}
            </h1>
            <div className="space-y-3">
              {/* 주소, 날짜, 인원 정보 */}
              <div className="text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                {meetingDetail.location.address}
                {"\n"}
                {formatDate(meetingDetail.meetingDate)}
                {meetingDetail.maxParticipants && (
                  <>
                    {"\n"}
                    👥 {meetingDetail.currentParticipants || 1}/{meetingDetail.maxParticipants}
                  </>
                )}
              </div>

              {/* 카테고리*/}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-background border border-border text-foreground text-base px-2 py-0.5">
                  {meetingDetail.interestName}
                </Badge>
              </div>


              <button
                onClick={handleJoinMeeting}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm font-medium"
              >
                {isLoggedIn ? "신청하기" : "로그인하고 신청하기"}
              </button>
            </div>
          </div>
        </div>
        {/* 모이머 */}
        <Card className="border-2 border-primary/30 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              모이머
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 bg-muted">
                <div className="w-full h-full rounded-full bg-muted border border-border flex items-center justify-center text-lg">
                  O
                </div>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{meetingDetail.host.nickname}</div>
                {meetingDetail.host.bio && (
                  <div className="text-xs text-muted-foreground">{meetingDetail.host.bio}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 설명 */}
        <Card className="border-2 border-primary/30 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">우리 모임은요...</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div
              ref={descriptionRef}
              className={`text-sm text-foreground whitespace-pre-wrap leading-relaxed transition-all duration-300 ${isDescriptionExpanded ? '' : 'max-h-64 overflow-y-auto'
                }`}
            >
              {meetingDetail.description}
            </div>
            {showExpandButton && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-3 text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                {isDescriptionExpanded ? '접기' : '자세히보기'}
              </button>
            )}
          </CardContent>
        </Card>

        {/* 지도 */}
        <Card className="border-2 border-primary/30 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">여기에서 만나요!</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
              <KakaoMapView
                lat={meetingDetail.location.lat}
                lng={meetingDetail.location.lng}
                placeName={meetingDetail.location.address}
                level={3}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
              <IoLocationOutline className="text-lg text-primary" />
              {meetingDetail.location.address}
            </p>
          </CardContent>
        </Card>

        {/* 모이미 */}
        <Card className="border-2 border-primary/30 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              모이미 ({meetingDetail.currentParticipants || 1}/{meetingDetail.maxParticipants})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            {/* 추후 참가자 목록으로 교체 예정 */}
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 bg-muted">
                <div className="w-full h-full rounded-full bg-muted border border-border flex items-center justify-center text-lg">
                  O
                </div>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{meetingDetail.host.nickname}</div>
                {meetingDetail.host.bio && (
                  <div className="text-xs text-muted-foreground">{meetingDetail.host.bio}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <FixedBottomButton onClick={handleJoinMeeting}>
        {isLoggedIn ? "이 모임 신청하기" : "로그인하고 신청하기"}
      </FixedBottomButton>

      <LoginRequiredDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
      />
    </div>
  );
}

export default MeetingDetailPage;
