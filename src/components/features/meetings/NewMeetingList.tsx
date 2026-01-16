import MeetingListSection from "@/components/common/MeetingListSection";

function NewMeetingList() {
  return (
    <MeetingListSection
      title="최근에 생긴 모임"
      queryOptions={{ sort: "NEW", limit: 8 }}
      seeMoreHref="/meetings?sort=NEW"
    />
  );
}

export default NewMeetingList;
