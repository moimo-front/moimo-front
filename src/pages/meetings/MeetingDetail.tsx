import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { IoLocationOutline } from "react-icons/io5";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getMeetingById } from "@/api/meeting.api";
import type { MeetingDetail } from "@/models/meeting.model";
import moimoMeeting from "@/assets/images/moimo-meetings.png";
import { useAuthStore } from "@/store/authStore";
import LoginRequiredDialog from "@/components/features/login/LoginRequiredDialog";
import KakaoMapView from "@/components/features/meetings/kakaoMaps/KakaoMapView";
import { toast } from "sonner";
import CreateMeetingModal from "@/components/features/meetings/CreateMeetingModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useJoinMeetingMutation } from "@/hooks/useMeetingMutations";
import { useMeQuery } from "@/hooks/useMeQuery";
import MeetingActionButtons from "@/components/features/meetings/MeetingActionButtons";
import { formatMeetingDate } from "@/utils/dateFormat";
import { useNavigate } from "react-router-dom";
import { useDeleteMeetingDialog } from "@/hooks/useDeleteMeetingDialog";
import { useInterestQuery } from "@/hooks/useInterestQuery";

function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [meetingDetail, setMeetingDetail] = useState<MeetingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // 로그인 상태 및 모달 관리
  const { isLoggedIn, nickname } = useAuthStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 모임 신청 mutation
  const joinMeetingMutation = useJoinMeetingMutation();
  const navigate = useNavigate();

  // 모임 삭제
  const { handleDeleteMeeting, DeleteConfirmDialog } = useDeleteMeetingDialog({
    onSuccess: () => navigate("/mypage/meetings/hosting")
  });

  // 내가 신청한/참가한 모임 목록 조회
  const { meetings: pendingMeetings } = useMeQuery("joined", "pending", 1, 50);
  const { meetings: joinedMeetings } = useMeQuery("joined", "accepted", 1, 50);

  // 카테고리 목록 조회 (이름 매핑용)
  const { data: interests } = useInterestQuery();

  // 내 모임인지 확인
  const isHost = meetingDetail?.host.nickname === nickname;

  // 내가 이미 신청한 모임인지 확인
  useEffect(() => {
    if (meetingId && pendingMeetings) {
      const isAlreadyApplied = pendingMeetings.some(
        (meeting) => meeting.meetingId === Number(meetingId)
      );
      setIsPending(isAlreadyApplied);
    }
  }, [meetingId, pendingMeetings]);

  useEffect(() => {
    const fetchMeetingDetail = async () => {
      if (!meetingId) {
        console.log("meetingId가 없습니다");
        return;
      }
      try {
        setIsLoading(true);
        const response = await getMeetingById(meetingId);
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

    // 신청 확인 모달 표시
    setShowJoinConfirm(true);
  };

  const handleConfirmJoin = async () => {
    if (!meetingId) return;
    try {
      await joinMeetingMutation.mutateAsync(Number(meetingId));
      setIsPending(true);
      toast.success("모임 신청이 완료되었습니다. 모이머의 승인을 기다려주세요!");
      setShowJoinConfirm(false);
    } catch (error: any) {
      console.error("모임 신청 에러:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error;

      if (error.response?.status === 400) {
        toast.error(errorMessage || "모임 신청에 실패했습니다");
      } else if (error.response?.status === 409) {
        toast.warning("이미 신청한 모임입니다");
        setIsPending(true);
      } else if (error.response?.status === 410) {
        toast.error("삭제된 모임입니다");
      } else {
        toast.error("모임 신청 중 오류가 발생했습니다");
      }
      setShowJoinConfirm(false);
    }
  };
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



  return (
    <div className="flex flex-col min-h-screen bg-background">



      <div className="flex-1 w-full max-w-5xl mx-auto pb-8 space-y-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* 이미지 */}
          <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-sm border border-border/50">
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
          <div className="flex-1 flex flex-col gap-6 justify-center">
            <div className="w-full py-2">
              <div className="flex items-start justify-between pb-3">
                {/* 수정/삭제 버튼 - 호스트일 때만 표시 */}
                {isHost && (
                  <div className="ml-auto">
                    <MeetingActionButtons
                      meetingId={Number(meetingId)}
                      role="host"
                      location="detail-top"
                      onEdit={() => setShowEditModal(true)}
                      onDelete={() => handleDeleteMeeting(Number(meetingId))}
                    />
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {meetingDetail.title}
            </h1>
            <div className="space-y-3">
              {/* 주소, 날짜, 인원 정보 */}
              <div className="text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                {meetingDetail.location.address}
                {"\n"}
                {formatMeetingDate(meetingDetail.meetingDate)}
                {meetingDetail.maxParticipants && (
                  <>
                    {"\n"}
                    👥 {meetingDetail.currentParticipants || 1}/{meetingDetail.maxParticipants}
                  </>
                )}
              </div>

              {/* 카테고리*/}
              <div className="flex items-center gap-2 mt-2">
                {(meetingDetail.interestName || interests?.find(i => i.id === meetingDetail.interestId)?.name) && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-base px-3 py-1.5 font-medium border-primary/20">
                    {meetingDetail.interestName || interests?.find(i => i.id === meetingDetail.interestId)?.name}
                  </Badge>
                )}
              </div>


              <MeetingActionButtons
                meetingId={Number(meetingId)}
                role={isHost ? "host" : "participant"}
                location="detail-mid"
                isPending={isPending}
                isJoined={joinedMeetings?.some((m) => m.meetingId === Number(meetingId))}
                isLoggedIn={isLoggedIn}
                onJoin={handleJoinMeeting}
                onChat={() => navigate("/chats", { state: { meetingId: Number(meetingId) } })}
              />
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
            <div className="w-full h-128 bg-muted rounded-lg overflow-hidden">
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
      <MeetingActionButtons
        meetingId={Number(meetingId)}
        role={isHost ? "host" : "participant"}
        location="detail-bottom"
        isPending={isPending}
        isJoined={joinedMeetings?.some((m) => m.meetingId === Number(meetingId))}
        isLoggedIn={isLoggedIn}
        onJoin={handleJoinMeeting}
        onChat={() => navigate("/chats", { state: { meetingId: Number(meetingId) } })}
      />
      <DeleteConfirmDialog />


      <LoginRequiredDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
      />

      {/* 수정 모달 */}
      {showEditModal && meetingDetail && (
        <CreateMeetingModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          meeting={meetingDetail}
        />
      )}

      {/* 신청 확인 모달 */}
      <ConfirmDialog
        open={showJoinConfirm}
        onOpenChange={setShowJoinConfirm}
        title="모임 신청"
        description={`해당 모임을 신청하시겠습니까?\n 신청 후 취소가 불가능합니다.`}
        confirmText="신청하기"
        cancelText="취소"
        onConfirm={handleConfirmJoin}
      />

      {/* 삭제 확인 모달 */}

    </div>
  );
}

export default MeetingDetailPage;
