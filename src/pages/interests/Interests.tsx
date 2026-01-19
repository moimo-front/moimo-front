import TopicCard from "@features/topics/TopicCard";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import { Skeleton } from "@/components/ui/skeleton";

const Interests = () => {
  const { data: interests, isLoading, error } = useInterestQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-10 py-16 px-4 md:px-8">
        {[...Array(8)].map((_, index) => (
          <Skeleton key={index} className="w-full h-48 rounded-lg" />
        ))}
      </div>
    );
  }
  if (error) return <div>Error loading interests: {error.message}</div>;

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-10 py-16 px-4 md:px-8">
        {interests?.map((interest) => (
          <TopicCard
            key={interest.id}
            topicName={interest.name}
            to={`/meetings?interestFilter=${interest.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Interests;
