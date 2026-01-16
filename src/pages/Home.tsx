import NewMeetingList from "@/components/features/meetings/NewMeetingList";
import JoinedMeetingsList from "@features/meetings/JoinedMeetingsList";
import PendingMeetingsList from "@features/meetings/PendingMeetingsList";
import SearchSection from "@features/search/SearchSection";
import TopicSection from "@features/topics/TopicSection";
import { useAuthStore } from "@store/authStore";

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
        <NewMeetingList />
      </div>
    </div>
  );
}

export default Home;
