import MeetingListSection from "@/components/common/MeetingListSection";

function PendingMeetingsList() {
  // TODO: 사용자가 신청한 모임만 불러오도록 queryOptions를 수정
  return (
    <MeetingListSection
      title="{nickname} 님이 신청한 모임"
      queryOptions={{ limit: 4 }}
      seeMoreHref="/meetings/pending" // TODO: 경로 수정
    />
  );
}

export default PendingMeetingsList;
