import TopicCard from "@features/topics/TopicCard";
import { useInterestQuery } from "@/hooks/useInterestQuery";

const Interests = () => {
  const { data: interests, isLoading, error } = useInterestQuery();

  if (isLoading) return <div>Loading interests...</div>;
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
