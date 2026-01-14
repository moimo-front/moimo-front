import MeetingListSection from "@/components/common/MeetingListSection";

function PopularMeetingList() {
  return (
    <MeetingListSection
      title="주간 인기 모임"
      queryOptions={{ sort: "POPULAR", limit: 8 }}
      seeMoreHref="/meetings?sort=POPULAR"
    />
  );
}

export default PopularMeetingList;
