import MeetingListSection from "@/components/common/MeetingListSection";

function JoinedMeetingsList() {
  // TODO: 사용자가 가입한 모임만 불러오도록 queryOptions를 수정
  return (
    <MeetingListSection
      title="{nickname} 님이 가입한 모임"
      queryOptions={{ limit: 4 }}
      seeMoreHref="/meetings/joined" // TODO: 경로 수정
    />
  );
}

export default JoinedMeetingsList;
