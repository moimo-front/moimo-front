import JoinedMeetingsList from "@/components/common/JoinedMeetingsList";
import PendingMeetingsList from "@/components/common/PendingMeetingsList";
import PopularMeetingList from "@/components/common/PopularMeetingList";
import SearchSection from "@/components/common/SearchSection";
import TopicSection from "@/components/common/TopicSection";
import { useAuthStore } from "@/store/authStore";

function Home() {
  const { isLoggedIn } = useAuthStore();
  return (
    <div className="flex flex-col justify-center items-center">
      <SearchSection />
      <div className="flex flex-col pt-8 items-center w-full bg-card">
        <TopicSection />
        {isLoggedIn && (
          <>
            <JoinedMeetingsList />
            <PendingMeetingsList />
          </>
        )}
        <PopularMeetingList />
      </div>
    </div>
  );
}

export default Home;
